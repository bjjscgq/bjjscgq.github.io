* Encoding: GBK.
BEGIN PROGRAM python.
import spss
spss.StartDataStep()
datasetObj = spss.Dataset()
casesObj = datasetObj.cases
yearList = []
annualMedicalExpenses = []
absoluteIncrementPerYear = []
absoluteIncrementTotal = []
fixedBaseRelative = []
linkRelative = []
fixedBaseRelative1 = []
linkRelative1 = []
theFirstYear, annualMedicalExpensesOfTheFirstYear = casesObj[0]
for i in range(len(casesObj)):
    year, annualMedicalExpensesOfTheYear = casesObj[i]
    yearList.append(year)
    annualMedicalExpenses.append(annualMedicalExpensesOfTheYear)
    if i == 0:
        absoluteIncrementPerYear.append('--')
        absoluteIncrementTotal.append('--')
        fixedBaseRelative.append('100.0')
        linkRelative.append('100.0')
        fixedBaseRelative1.append('--')
        linkRelative1.append('--')
    else:
        lastYear, annualMedicalExpensesOfLastYear = casesObj[i-1]
        absoluteIncrementPerYear.append(str(int(annualMedicalExpensesOfTheYear - annualMedicalExpensesOfLastYear)))
        absoluteIncrementTotal.append(str(int(annualMedicalExpensesOfTheYear - annualMedicalExpensesOfTheFirstYear)))
        fixedBaseRelative.append("%.1f"%(100*annualMedicalExpensesOfTheYear/annualMedicalExpensesOfTheFirstYear))
        fixedBaseRelative1.append("%.1f"%(100*annualMedicalExpensesOfTheYear/annualMedicalExpensesOfTheFirstYear-100))
        linkRelative.append("%.1f"%(100*annualMedicalExpensesOfTheYear/annualMedicalExpensesOfLastYear))
        linkRelative1.append("%.1f"%(100*annualMedicalExpensesOfTheYear/annualMedicalExpensesOfLastYear-100))

spss.EndDataStep()
spss.StartProcedure("proc")
table = spss.BasePivotTable("ĳ����2003-1010��ְ����ҽ�Ʒ��ö�̬�仯","mytable")
table.Append(spss.Dimension.Place.row,"���")
table.Append(spss.Dimension.Place.row,"��ҽ�Ʒ���")
table.Append(spss.Dimension.Place.column, "main", hideName=True)
table.Append(spss.Dimension.Place.column, "sub", hideName=True)

for i in range(len(absoluteIncrementTotal)):
    table[(spss.CellText.Number(int(yearList[i]),  spss.FormatSpec.Count), spss.CellText.Number(int(annualMedicalExpenses[i]), spss.FormatSpec.Count),
 spss.CellText.String("����������"), spss.CellText.String("�ۼ�"))] = spss.CellText.String(absoluteIncrementTotal[i])
    table[(spss.CellText.Number(int(yearList[i]),  spss.FormatSpec.Count), spss.CellText.Number(int(annualMedicalExpenses[i]), spss.FormatSpec.Count),
 spss.CellText.String("����������"), spss.CellText.String("����"))] = spss.CellText.String(absoluteIncrementPerYear[i])
    table[(spss.CellText.Number(int(yearList[i]),  spss.FormatSpec.Count), spss.CellText.Number(int(annualMedicalExpenses[i]), spss.FormatSpec.Count),
 spss.CellText.String("��չ�ٶ�(%)"), spss.CellText.String("������"))] = spss.CellText.String(fixedBaseRelative[i])
    table[(spss.CellText.Number(int(yearList[i]),  spss.FormatSpec.Count), spss.CellText.Number(int(annualMedicalExpenses[i]), spss.FormatSpec.Count),
 spss.CellText.String("��չ�ٶ�(%)"), spss.CellText.String("����"))] = spss.CellText.String(linkRelative[i])
    table[(spss.CellText.Number(int(yearList[i]),  spss.FormatSpec.Count), spss.CellText.Number(int(annualMedicalExpenses[i]), spss.FormatSpec.Count),
 spss.CellText.String("�����ٶ�(%)"), spss.CellText.String("������"))] = spss.CellText.String(fixedBaseRelative1[i])
    table[(spss.CellText.Number(int(yearList[i]),  spss.FormatSpec.Count), spss.CellText.Number(int(annualMedicalExpenses[i]), spss.FormatSpec.Count),
 spss.CellText.String("�����ٶ�(%)"), spss.CellText.String("����"))] = spss.CellText.String(linkRelative1[i])
table.Caption("�������Ȩ���У��������Ǵ���ȥ��δ�����������û�ת��.")
spss.EndProcedure()
END PROGRAM.
