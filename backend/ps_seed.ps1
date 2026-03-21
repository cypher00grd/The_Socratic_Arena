$Url = "https://zjnpkxmtxayyvfpndfah.supabase.co/rest/v1/topics"
$Key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbnBreG10eGF5eXZmcG5kZmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTQzNTAsImV4cCI6MjA4OTIzMDM1MH0.aZA2S2zwZWdvQDCXlKo_m4Oed4MTfbTAMHhatPRAoA8"
$Headers = @{
  "apikey" = $Key
  "Authorization" = "Bearer $Key"
  "Content-Type" = "application/json"
  "Prefer" = "return=minimal"
}
$Body = '[{"title":"Technology","category":"Community"},{"title":"Geopolitics","category":"Community"},{"title":"Food","category":"Community"},{"title":"Travel","category":"Community"},{"title":"Science","category":"Community"},{"title":"Politics","category":"Community"},{"title":"Society","category":"Community"},{"title":"Philosophy","category":"Community"},{"title":"Sports","category":"Community"},{"title":"Economics","category":"Community"},{"title":"Health","category":"Community"},{"title":"Entertainment","category":"Community"},{"title":"Artificial Intelligence","category":"Community"},{"title":"Climate Change","category":"Community"},{"title":"Space Exploration","category":"Community"},{"title":"Cryptocurrency","category":"Community"},{"title":"Education System","category":"Community"},{"title":"Remote Work","category":"Community"},{"title":"Mental Health","category":"Community"},{"title":"Social Media","category":"Community"},{"title":"Renewable Energy","category":"Community"},{"title":"Universal Basic Income","category":"Community"},{"title":"Data Privacy","category":"Community"},{"title":"Genetic Engineering","category":"Community"},{"title":"Cybersecurity","category":"Community"},{"title":"Electric Vehicles","category":"Community"},{"title":"Global Warming","category":"Community"},{"title":"Human Rights","category":"Community"},{"title":"Automation","category":"Community"},{"title":"Future of Work","category":"Community"},{"title":"Healthcare Systems","category":"Community"},{"title":"Veganism","category":"Community"},{"title":"Censorship","category":"Community"},{"title":"Cancel Culture","category":"Community"},{"title":"Space Colonization","category":"Community"},{"title":"E-sports","category":"Community"},{"title":"Globalization","category":"Community"},{"title":"Nuclear Energy","category":"Community"},{"title":"Capitalism vs Socialism","category":"Community"},{"title":"Free Speech","category":"Community"},{"title":"Gun Control","category":"Community"},{"title":"Immigration","category":"Community"},{"title":"Artificial General Intelligence","category":"Community"},{"title":"Web3","category":"Community"},{"title":"Virtual Reality","category":"Community"},{"title":"Quantum Computing","category":"Community"},{"title":"Democracy","category":"Community"},{"title":"Freedom of Press","category":"Community"},{"title":"Income Inequality","category":"Community"},{"title":"Vaccine Mandates","category":"Community"}]'

Try {
  Invoke-RestMethod -Uri $Url -Method Post -Headers $Headers -Body $Body
  Write-Host "Topics successfully inserted via PowerShell"
} Catch {
  Write-Host "Error inserting topics: $_"
}
