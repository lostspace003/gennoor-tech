# Opens the presentation in PowerPoint, counts what PowerPoint itself sees (click steps,
# links, turning rings) and saves a picture of every slide, to look at.
#
#   pwsh scripts/show/check-deck.ps1 [-Deck <path>] [-Out <folder>]
#
# It works on a copy, opened read-only, so a deck you have open is never touched,
# and it only closes PowerPoint if PowerPoint was not already running.
param(
  [string]$Deck = "$PSScriptRoot\..\..\public\Gennoor-Tech-Catalog\Gennoor-Tech-Overview.pptx",
  [string]$Out = "$PSScriptRoot\.work\deck-check"
)
$Deck = (Resolve-Path $Deck).Path
Remove-Item -Recurse -Force $Out -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $Out | Out-Null
$copy = Join-Path $Out "copy.pptx"
Copy-Item $Deck $copy
$wasRunning = [bool](Get-Process POWERPNT -ErrorAction SilentlyContinue)
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $pres = $ppt.Presentations.Open($copy, $true, $false, $false)
  $links = 0
  foreach ($s in $pres.Slides) {
    $seq = $s.TimeLine.MainSequence
    $clicks = @($seq | Where-Object { $_.Timing.TriggerType -eq 1 }).Count      # 1 = on click
    $spins = @($seq | Where-Object { $_.EffectType -eq 61 }).Count              # 61 = spin
    $links += $s.Hyperlinks.Count
    "slide {0,2}: {1,3} effects, {2} clicks, {3} turning, {4} links" -f $s.SlideIndex, $seq.Count, $clicks, $spins, $s.Hyperlinks.Count
  }
  "slides: $($pres.Slides.Count), links: $links"
  $pres.Export($Out, "PNG", 1280, 720)
  $pres.Close()
} finally {
  if (-not $wasRunning) { $ppt.Quit() }
  Remove-Item $copy -ErrorAction SilentlyContinue
}
