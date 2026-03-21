import { Swords, Bookmark, BookmarkCheck, Users, Activity, Search, X, Layers, Compass, Flame, Trophy, ChevronDown, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getTopicDomain, broadTopicsList } from '../lib/domainUtils';
import React, { useEffect, useState, useMemo } from 'react';

const MyArena = ({ user, socket }) => {
  const navigate = useNavigate();

  const [pendingFollows, setPendingFollows] = useState(new Set());

  // localStorage-backed state for zero-delay navigation
  const [allTopics, setAllTopics] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myarena_all_topics')) || []; } catch { return []; }
  });
  const [allActiveMatches, setAllActiveMatches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myarena_all_active_matches')) || []; } catch { return []; }
  });
  const [followedTopics, setFollowedTopics] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myarena_topics')) || []; } catch { return []; }
  });
  const [followIds, setFollowIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myarena_follow_ids')) || []; } catch { return []; }
  });
  const [topicTotals, setTopicTotals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myarena_totals')) || {}; } catch { return {}; }
  });
  const [activeUserCounts, setActiveUserCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myarena_counts')) || {}; } catch { return {}; }
  });

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      // 1. Fetch ALL topics
      const { data: topicsData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (topicsData) {
        setAllTopics(topicsData);
        localStorage.setItem('myarena_all_topics', JSON.stringify(topicsData));
      }

      // 2. Fetch User Follows
      const { data: follows, error: followError } = await supabase
        .from('topic_follows')
        .select('topic_id')
        .eq('user_id', user.id);

      const ids = (follows || []).map(f => f.topic_id);
      setFollowIds(ids);
      localStorage.setItem('myarena_follow_ids', JSON.stringify(ids));

      const followed = (topicsData || []).filter(t => ids.includes(t.id));
      setFollowedTopics(followed);
      localStorage.setItem('myarena_topics', JSON.stringify(followed));
      const followedTitles = followed.map(t => t.title);

      // 3. Fetch Matches
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .in('status', ['active', 'completed', 'pending_votes'])
        .order('created_at', { ascending: false });

      if (matchData) {
        const totals = {};
        const activeCounts = {};
        const activeMatches = [];

        matchData.forEach(m => {
          const t = m.topic_title || m.topic || 'Unknown';
          totals[t] = (totals[t] || 0) + 1;
          
          if (m.status === 'active') {
            activeCounts[t] = (activeCounts[t] || 0) + 2;
          }

          // Include all matches (including completed) so the user can browse past debates for their followed topics
          activeMatches.push(m);
        });

        setTopicTotals(totals);
        setActiveUserCounts(activeCounts);
        setAllActiveMatches(activeMatches);
        
        localStorage.setItem('myarena_totals', JSON.stringify(totals));
        localStorage.setItem('myarena_counts', JSON.stringify(activeCounts));
        localStorage.setItem('myarena_all_active_matches', JSON.stringify(activeMatches));
      }
      setIsLoading(false);
    };

    fetchData();

    if (socket) {
      socket.on('new_topic_added', fetchData);
      socket.on('topic_result', (data) => {
        if (!data.success && data.message.includes('Similar topic')) {
           // It was a duplicate, try fetching again
           fetchData();
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('new_topic_added', fetchData);
        socket.off('topic_result');
      }
    };
  }, [user, socket]);

  // Auto-follow pending topics once they appear in the database
  useEffect(() => {
    if (pendingFollows.size === 0) return;
    
    let allFound = true;
    pendingFollows.forEach((pendingTitle) => {
      const found = allTopics.find(t => (t.title || '').toLowerCase() === pendingTitle);
      if (found) {
        // Execute toggle seamlessly
        handleToggleFollow(found.id);
        setPendingFollows(prev => {
          const next = new Set(prev);
          next.delete(pendingTitle);
          return next;
        });
      } else {
        allFound = false;
      }
    });

    // If some topics are still pending (due to db propagation delay or Gemini delay), poll every 3 seconds
    if (!allFound) {
      const timer = setTimeout(() => {
        // Only trigger a re-fetch if we are still waiting
        if (pendingFollows.size > 0) {
           // We manually re-fetch data
           const refetch = async () => {
             const { data } = await supabase.from('topics').select('*').order('created_at', { ascending: false });
             if (data) setAllTopics(data);
           };
           refetch();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [allTopics, pendingFollows]);

  const handleToggleFollow = async (topicId) => {
    const isFollowed = followIds.includes(topicId);
    
    // Optimistic UI update
    const newFollowIds = isFollowed ? followIds.filter(id => id !== topicId) : [...followIds, topicId];
    const newFollowedTopics = allTopics.filter(t => newFollowIds.includes(t.id));
    
    setFollowIds(newFollowIds);
    setFollowedTopics(newFollowedTopics);
    
    localStorage.setItem('myarena_follow_ids', JSON.stringify(newFollowIds));
    localStorage.setItem('myarena_topics', JSON.stringify(newFollowedTopics));

    if (isFollowed) {
      const { error } = await supabase.from('topic_follows').delete().eq('user_id', user.id).eq('topic_id', topicId);
      if (error) console.error("Unfollow error", error);
    } else {
      const { error } = await supabase.from('topic_follows').insert({ user_id: user.id, topic_id: topicId });
      if (error) console.error("Follow error", error);
    }
  };

  const handleEnterLobby = (topic) => {
    navigate(`/lobby/${topic.id}`, { state: { topic } });
  };

  // Domain tabs strictly from FULL followedTopics set as requested
  const domainTabs = useMemo(() => {
    const domainSet = new Map();
    followedTopics.forEach(topic => {
      const d = getTopicDomain(topic.title);
      if (!domainSet.has(d.domain)) {
        domainSet.set(d.domain, d);
      }
    });
    return Array.from(domainSet.entries()).map(([domain, info]) => ({
      domain,
      color: info.color,
    }));
  }, [followedTopics]);

  // Section 3: Saved Arenas filtered by Active Tab and Search
  const filteredFollowedTopics = useMemo(() => {
    let result = followedTopics.filter(t => !broadTopicsList.includes((t.title || '').toLowerCase()));
    if (activeTab !== 'ALL') {
      result = result.filter(topic => getTopicDomain(topic.title).domain === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(topic => topic.title.toLowerCase().includes(q));
    }
    return result;
  }, [followedTopics, activeTab, searchQuery]);

  const trendingMatches = useMemo(() => {
    const followedTitlesLower = followedTopics.map(t => (t.title || '').toLowerCase());
    return allActiveMatches.filter(m => {
      const t = m.topic_title || m.topic || '';
      const tLower = t.toLowerCase();
      const matchDomainLower = getTopicDomain(t).domain.toLowerCase();
      
      return followedTitlesLower.includes(tLower) || 
             followedTitlesLower.includes(matchDomainLower) || 
             followedTitlesLower.some(ft => tLower.includes(ft));
    });
  }, [allActiveMatches, followedTopics]);

  // Section 2: Trending Debates Filtered by Active Tab and Search
  const filteredTrendingMatches = useMemo(() => {
    let result = trendingMatches;
    if (activeTab !== 'ALL') {
      result = result.filter(match => getTopicDomain(match.topic_title || match.topic).domain === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(match => (match.topic_title || match.topic || '').toLowerCase().includes(q));
    }
    return result;
  }, [trendingMatches, activeTab, searchQuery]);

  // Helper to group matches for the trending section
  const groupMatches = (matches) => {
    const groups = {};
    matches
      .filter(m => (m.topic_title || m.topic) && (m.topic_title || m.topic).toLowerCase() !== 'custom debate')
      .forEach(m => {
        const title = m.topic_title || m.topic;
        if (!groups[title]) groups[title] = [];
        groups[title].push(m);
      });
    return groups;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#0b0f19] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto w-full">

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-100 flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Swords className="h-8 w-8 text-white" />
            </div>
            My Arena
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Your personalized battleground. Manage and track all your arenas.</p>
        </header>

        {/* --- SECTION 1: ALL POSSIBLE TOPICS (Pill/Chip List) --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3 border-b border-[#1e293b] pb-4">
            <Compass className="h-6 w-6 text-cyan-400" />
            Discover Topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Merge hardcoded categories with new categories discovered from DB topics */}
            {(() => {
              const broadSet = new Set(broadTopicsList);
              // Extract unique category names from DB topics that aren't already in broadTopicsList
              const extraCategories = new Set();
              allTopics.forEach(t => {
                const title = (t.title || '').toLowerCase();
                if (!title) return;
                // If it's already a broad topic, skip
                if (broadSet.has(title)) return;
                // Use domain classifier to get category for debate questions
                const domain = getTopicDomain(t.title);
                const cat = domain.domain.toLowerCase();
                // Only add if it's a genuinely new category not already covered
                if (cat !== 'general' && !broadSet.has(cat)) {
                  extraCategories.add(cat);
                } else if (cat === 'general') {
                  // For uncategorized topics, use the title itself as a category
                  // but only if it looks like a category name (short, no question marks)
                  if (title.length < 30 && !title.includes('?') && !title.includes(' vs ')) {
                    extraCategories.add(title);
                  }
                }
              });
              return [...broadTopicsList, ...Array.from(extraCategories)];
            })().map((topicTitleKey) => {
              // Attempt to find if the topic already exists in the database
              let dbTopic = allTopics.find(t => (t.title || '').toLowerCase() === topicTitleKey);
              const isFollowed = dbTopic ? followIds.includes(dbTopic.id) : false;

              // Title Casing for display
              const displayTitle = topicTitleKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

              return (
                <button
                  key={topicTitleKey}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dbTopic) {
                      handleToggleFollow(dbTopic.id);
                    } else if (socket) {
                      setPendingFollows(prev => new Set(prev).add(topicTitleKey));
                      socket.emit('propose_topic', { newTopic: displayTitle });
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 transition-all ${!dbTopic && pendingFollows.has(topicTitleKey) ? 'animate-pulse opacity-70' : 'active:scale-95'} ${
                    isFollowed 
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                      : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-300'
                  }`}
                  title={isFollowed ? 'Unfollow Topic' : 'Follow Topic'}
                >
                  {displayTitle}
                  {isFollowed ? <BookmarkCheck className="h-4 w-4 text-amber-400" /> : <Bookmark className="h-4 w-4 text-slate-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Subtabs for Section 2 & 3 */}
        <div className="mb-6 mt-12">
          <h2 className="text-xl font-bold text-slate-100 mb-4 tracking-wide">Filter arena</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveTab('ALL')}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 border ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-transparent shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              All Followed
            </button>
            {domainTabs.map(tab => {
              const count = followedTopics.filter(t => getTopicDomain(t.title).domain === tab.domain).length;
              return (
                <button
                  key={tab.domain}
                  onClick={() => setActiveTab(tab.domain)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                    activeTab === tab.domain
                      ? `${tab.color} shadow-lg text-white`
                      : 'bg-slate-900/60 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {tab.domain} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mb-8 relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search your followed arenas or active debates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-12 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 p-1 hover:bg-slate-800 rounded-full transition-colors">
              <X className="h-4 w-4 text-slate-400 hover:text-slate-200" />
            </button>
          )}
        </div>

        {/* --- SECTION 2: TRENDING DEBATES (Filtered) --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3 border-b border-[#1e293b] pb-4">
            <Flame className="h-6 w-6 text-rose-500" />
            Trending Debates
          </h2>
          {filteredTrendingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupMatches(filteredTrendingMatches)).map(([title, matches]) => {
                const hasMultiple = matches.length > 1;
                const activeCount = matches.filter(m => m.status === 'active').length;
                
                return (
                  <div 
                    key={`trending-${title}`}
                    onClick={() => navigate(`/topic/${encodeURIComponent(title)}`)}
                    className="group cursor-pointer relative bg-rose-950/10 border border-rose-500/20 rounded-xl p-6 flex flex-col h-full hover:border-rose-500/40 transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.1)] active:scale-[0.98]"
                  >
                    {hasMultiple && (
                      <>
                        <div className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-20">
                          {activeCount > 0 ? 'LIVE STACK' : 'VOTE STACK'}
                        </div>
                        <div className="absolute inset-0 bg-rose-500/5 rounded-xl translate-x-2 translate-y-2 -z-10 border border-rose-500/10"></div>
                        <div className="absolute inset-0 bg-rose-500/5 rounded-xl translate-x-4 translate-y-4 -z-20 border border-rose-500/10"></div>
                      </>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      {activeCount > 0 ? (
                         <Activity className="h-6 w-6 text-rose-400 animate-pulse" />
                      ) : (
                         <Layers className="h-6 w-6 text-purple-400" />
                      )}
                      <h3 className="text-xl font-bold text-slate-100 line-clamp-2 flex-1">{title}</h3>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className={`${activeCount > 0 ? 'text-rose-400' : 'text-purple-400'} font-bold text-sm tracking-tighter`}>
                        {matches.length} {matches.length === 1 ? 'ACTIVE DEBATE' : 'DEBATES'}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-rose-300 transition-colors">
                        <span className="text-xs font-bold uppercase">View Stack</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-slate-500 text-sm italic p-6 border border-dashed border-slate-700/50 rounded-xl text-center bg-slate-900/20">
               No trending debates currently match your filters in your followed topics.
             </div>
          )}
        </div>

        {/* --- SECTION 3: SAVED ARENAS (Filtered) --- */}
        <div className="mb-12">
           <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3 border-b border-[#1e293b] pb-4">
            <Trophy className="h-6 w-6 text-emerald-500" />
            Saved Arenas
          </h2>
          {filteredFollowedTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFollowedTopics.map((topic) => {
                const domain = getTopicDomain(topic.title);
                return (
                  <div
                    key={topic.id}
                    className="bg-slate-900/50 backdrop-blur-md border border-[#1e293b] rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-1 flex flex-col h-full group"
                  >
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <h3 className="text-xl font-bold text-slate-100 leading-snug flex-1">
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${domain.color}`}>
                          {domain.domain}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleFollow(topic.id); }}
                          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all group/btn"
                          title="Unfollow"
                        >
                          <BookmarkCheck className="h-4 w-4 text-emerald-400 group-hover/btn:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>

                    {/* Stats footer */}
                    <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#1e293b]">
                      <div className="flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm font-medium">
                            {(activeUserCounts[topic.title] || 0).toLocaleString()} Active
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">
                            {(topicTotals[topic.title] || 0).toLocaleString()} Played
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnterLobby(topic)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        Enter Lobby
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-500 text-sm italic p-6 border border-dashed border-slate-700/50 rounded-xl text-center bg-slate-900/20">
              Your arena is currently empty or no matched arenas found for the filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyArena;
