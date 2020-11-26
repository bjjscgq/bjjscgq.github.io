* Encoding: UTF-8.
GLM t0 t1 BY group
  /WSFACTOR=time 2 Polynomial 
  /MEASURE=心率 
  /METHOD=SSTYPE(3)
  /PLOT=PROFILE(time*group)
  /PRINT=DESCRIPTIVE 
  /CRITERIA=ALPHA(.05)
  /WSDESIGN=time 
  /DESIGN=group.
