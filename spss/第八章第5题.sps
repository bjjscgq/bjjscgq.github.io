﻿* Encoding: UTF-8.
EXAMINE VARIABLES=数值
  /ID=组别
  /PLOT BOXPLOT NPPLOT
  /COMPARE GROUPS
  /STATISTICS DESCRIPTIVES
  /CINTERVAL 95
  /MISSING LISTWISE
  /NOTOTAL.

*Nonparametric Tests: Independent Samples. 
NPTESTS 
  /INDEPENDENT TEST (数值) GROUP (组别) 
  /MISSING SCOPE=ANALYSIS USERMISSING=EXCLUDE
  /CRITERIA ALPHA=0.05  CILEVEL=95.
