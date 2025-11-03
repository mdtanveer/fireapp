import { PlanInputs, ProjectionResult, YearRow } from '../types/plan';

export function projectPlan(inputs: PlanInputs): ProjectionResult {
  const rows: YearRow[] = [];
  const retirementIndex = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const years = Math.max(0, inputs.lifeExpectancyAge - inputs.currentAge);
  let endBalancePrev = inputs.currentNetWorth;
  let depletionAge: number | undefined = undefined;

  for (let i = 0; i <= years; i += 1) {
    const age = inputs.currentAge + i;
    const startBalance = endBalancePrev;
    const isRetired = i >= retirementIndex;
    const r = isRetired ? inputs.postRetirementReturn : inputs.preRetirementReturn;

    // grow income/expenses with inflation
    const income = inputs.annualIncome * Math.pow(1 + inputs.inflationRate, i);
    const expenses = inputs.annualExpenses * Math.pow(1 + inputs.inflationRate, i);
    const contribution = isRetired ? 0 : Math.max(0, income - expenses);

    let withdrawal = 0;
    if (isRetired) {
      const targetNominal = inputs.spendingInTodaysDollars
        ? inputs.targetRetirementSpending * Math.pow(1 + inputs.inflationRate, i)
        : inputs.targetRetirementSpending;
      withdrawal = Math.max(0, targetNominal);
    }

    const midBalance = startBalance + contribution - withdrawal;
    const endBalance = midBalance * (1 + r);
    const investmentReturn = endBalance - midBalance;
    const endBalanceReal = endBalance / Math.pow(1 + inputs.inflationRate, i);

    if (depletionAge === undefined && endBalance < 0) {
      depletionAge = age;
    }

    rows.push({
      year: i,
      age,
      startBalance,
      contribution,
      withdrawal,
      investmentReturn,
      endBalance,
      endBalanceReal,
    });

    endBalancePrev = endBalance;
  }

  const retirementBalance = rows[retirementIndex]?.endBalance ?? inputs.currentNetWorth;
  const success = rows.every((r) => r.endBalance >= 0);
  return { rows, retirementIndex, retirementBalance, depletionAge, success };
}


