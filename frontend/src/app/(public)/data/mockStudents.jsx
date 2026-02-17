const generateStudents = () => {
  const students = [];

  // 10 alunos risco alto (70-95%)
  for (let i = 1; i <= 10; i++) {
    students.push({
      id: `A${String(i).padStart(3, "0")}`,
      serie: Math.floor(Math.random() * 4) + 6,
      riskLevel: "alto",
      probability: Math.floor(Math.random() * 26) + 70,
      averageGrade: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      absenceRate: parseFloat((Math.random() * 20 + 25).toFixed(1)),
      totalAbsences: Math.floor(Math.random() * 30) + 20,
      totalClasses: 80,
      trend: "down",
    });
  }

  // 20 alunos risco médio (40-69%)
  for (let i = 11; i <= 30; i++) {
    students.push({
      id: `A${String(i).padStart(3, "0")}`,
      serie: Math.floor(Math.random() * 4) + 6,
      riskLevel: "medio",
      probability: Math.floor(Math.random() * 30) + 40,
      averageGrade: parseFloat((Math.random() * 2 + 5).toFixed(1)),
      absenceRate: parseFloat((Math.random() * 15 + 10).toFixed(1)),
      totalAbsences: Math.floor(Math.random() * 15) + 8,
      totalClasses: 80,
      trend: Math.random() > 0.5 ? "stable" : "down",
    });
  }

  // 20 alunos risco baixo (5-39%)
  for (let i = 31; i <= 50; i++) {
    students.push({
      id: `A${String(i).padStart(3, "0")}`,
      serie: Math.floor(Math.random() * 4) + 6,
      riskLevel: "baixo",
      probability: Math.floor(Math.random() * 35) + 5,
      averageGrade: parseFloat((Math.random() * 2 + 7).toFixed(1)),
      absenceRate: parseFloat((Math.random() * 8 + 2).toFixed(1)),
      totalAbsences: Math.floor(Math.random() * 6) + 1,
      totalClasses: 80,
      trend: Math.random() > 0.3 ? "up" : "stable",
    });
  }

  return students.sort((a, b) => b.probability - a.probability);
};

export const mockStudents = generateStudents();

export const getStatistics = () => {
  const total = mockStudents.length;

  const highRisk = mockStudents.filter(
    (s) => s.riskLevel === "alto"
  ).length;

  const mediumRisk = mockStudents.filter(
    (s) => s.riskLevel === "medio"
  ).length;

  const lowRisk = mockStudents.filter(
    (s) => s.riskLevel === "baixo"
  ).length;

  return {
    total,
    highRisk,
    mediumRisk,
    lowRisk,
    highRiskPercent: ((highRisk / total) * 100).toFixed(0),
    mediumRiskPercent: ((mediumRisk / total) * 100).toFixed(0),
    lowRiskPercent: ((lowRisk / total) * 100).toFixed(0),
  };
};
