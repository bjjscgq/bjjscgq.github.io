* Encoding: GBK.

DATASET ACTIVATE DataSet0.
WEIGHT BY freq.

CROSSTABS
  /TABLES=��� BY Ч��
  /FORMAT=AVALUE TABLES
  /STATISTICS=CHISQ 
  /CELLS=COUNT
  /COUNT ROUND CELL.
