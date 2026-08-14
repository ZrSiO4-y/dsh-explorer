param([Parameter(Mandatory=$true)][string]$Src, [Parameter(Mandatory=$true)][string]$Dst)
$ErrorActionPreference = 'Stop'
$pp = New-Object -ComObject PowerPoint.Application
try {
  $pres = $pp.Presentations.Open($Src, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
  $pres.SaveAs($Dst, 32)
  $pres.Close()
} finally {
  $pp.Quit()
}
