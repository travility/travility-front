import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import ExpenseItem from './ExpenseItem';
import styles from '../../../styles/accountbook/AccountBookDetail.module.css';
import { Button } from '../../../styles/StyledComponents';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  formatNumberWithCommas,
  calculateTotalExpenseInKRW,
  calculateTotalBudgetInKRW,
  calculateTotalBudget,
  calculateTotalExpenses,
  calculateAverageExchangeRates,
} from '../../../util/calcUtils';
import { selectStyles } from '../../../util/CustomStyles';
import ExportAccountBook from '../../../components/ExportAccountBook';

const ExpenseList = ({ accountBook, selectedDate }) => {
  const [filter, setFilter] = useState('all');
  const [currency, setCurrency] = useState({ label: '전체', value: 'all' });
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let filteredExp = accountBook.expenses;
    let filteredBudg = accountBook.budgets;

    const formatDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    //여행 시작날짜
    const startDate = formatDate(accountBook.startDate);

    //여행 종료날짜
    const endDate = formatDate(accountBook.endDate);

    if (
      selectedDate !== 'all' &&
      selectedDate !== 'preparation' &&
      selectedDate !== 'after'
    ) {
      //선택된 날짜 지출 필터링 ('전체' or '준비' or '사후' 아닐 경우)
      const selected = formatDate(selectedDate);
      filteredExp = filteredExp.filter(
        (expense) =>
          formatDate(expense.expenseDate).getTime() === selected.getTime()
      );
    } else if (selectedDate === 'preparation') {
      //'준비'일경우, 시작 날짜 이전 지출 필터링
      filteredExp = filteredExp.filter(
        (expense) => formatDate(expense.expenseDate) < startDate
      );
    } else if (selectedDate === 'after') {
      filteredExp = filteredExp.filter(
        (expense) => formatDate(expense.expenseDate) > endDate
      );
    }

    //개인 or 공동경비 필터링
    if (filter === 'shared') {
      filteredExp = filteredExp.filter((expense) => expense.isShared);
      filteredBudg = filteredBudg.filter((budget) => budget.isShared);
    } else if (filter === 'personal') {
      filteredExp = filteredExp.filter((expense) => !expense.isShared);
      filteredBudg = filteredBudg.filter((budget) => !budget.isShared);
    }

    //화폐 필터링
    if (currency.value !== 'all') {
      //'전체' 아니면 해당 화폐 코드 지출 필터링
      filteredExp = filteredExp.filter(
        (expense) => expense.curUnit === currency.value
      );
      filteredBudg = filteredBudg.filter(
        (budget) => budget.curUnit === currency.value
      );
    }

    //오름차순 정렬
    filteredExp = filteredExp.sort(
      (a, b) => new Date(a.expenseDate) - new Date(b.expenseDate)
    );

    setFilteredExpenses(filteredExp);
    setFilteredBudgets(filteredBudg);
  }, [
    accountBook.startDate,
    accountBook.endDate,
    selectedDate,
    filter,
    currency,
    accountBook.expenses,
    accountBook.budgets,
  ]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleCurrencyChange = (selectedOption) => {
    setCurrency(selectedOption || { label: '전체', value: 'all' });
  };

  //정산하기 이동
  const goSettlement = () => {
    const sharedExpenses = accountBook.expenses.filter(
      (expense) => expense.isShared
    );
    if (sharedExpenses.length === 0) {
      Swal.fire({
        title: '정산 실패',
        text: '정산할 공동경비 지출이 없습니다',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
    } else {
      navigate(`/settlement/${accountBook.id}`);
    }
  };

  //내보내기 이동
  const goExport = () => {
    if (accountBook.expenses.length === 0) {
      Swal.fire({
        title: '내보내기 실패',
        text: '지출이 없습니다',
        icon: 'error',
        confirmButtonColor: '#2a52be',
      });
    } else {
      setIsExportModalOpen(true);
    }
  };

  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const date = new Date(expense.expenseDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {});

  const uniqueCurrencies = useMemo(() => {
    return Array.from(
      new Set(accountBook.budgets.map((budget) => budget.curUnit))
    ).map((curUnit) => ({
      label: curUnit,
      value: curUnit,
    }));
  }, [accountBook.budgets]);

  const totalBudget =
    currency.value === 'all'
      ? calculateTotalBudgetInKRW(filteredBudgets)
      : calculateTotalBudget(filteredBudgets, currency.value);

  const fomattedTotalBudget =
    currency.value === 'all'
      ? formatNumberWithCommas(totalBudget)
      : formatNumberWithCommas(totalBudget.toFixed(2));

  const totalExpensesInKRW = calculateTotalExpenseInKRW(
    filteredExpenses,
    accountBook.budgets
  );

  const totalExpensesInSelectedCurrency = calculateTotalExpenses(
    filteredExpenses,
    currency.value
  );

  const calculateCumulativeTotalExpenses = (selectedDate, currency) => {
    const formatDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const selected = formatDate(selectedDate);

    let cumulativeExpenses = accountBook.expenses.filter((expense) => {
      const expenseDate = formatDate(expense.expenseDate);
      return expenseDate <= selected;
    });

    if (filter === 'shared') {
      cumulativeExpenses = cumulativeExpenses.filter(
        (expense) => expense.isShared
      );
    } else if (filter === 'personal') {
      cumulativeExpenses = cumulativeExpenses.filter(
        (expense) => !expense.isShared
      );
    }

    if (currency !== 'all') {
      cumulativeExpenses = cumulativeExpenses.filter(
        (expense) => expense.curUnit === currency
      );
      return calculateTotalExpenses(cumulativeExpenses, currency);
    }

    return calculateTotalExpenseInKRW(cumulativeExpenses, accountBook.budgets);
  };

  const cumulativeTotalExpenses =
    selectedDate !== 'all' &&
    selectedDate !== 'preparation' &&
    selectedDate !== 'after'
      ? calculateCumulativeTotalExpenses(selectedDate, currency.value)
      : currency.value === 'all'
      ? totalExpensesInKRW
      : calculateTotalExpenses(filteredExpenses, currency.value);

  const formattedCumulativeTotalExpenses =
    currency.value === 'all'
      ? formatNumberWithCommas(parseFloat(cumulativeTotalExpenses).toFixed(0))
      : formatNumberWithCommas(parseFloat(cumulativeTotalExpenses).toFixed(2));

  const remainingBudget =
    currency.value === 'all'
      ? formatNumberWithCommas(
          (totalBudget - parseFloat(cumulativeTotalExpenses)).toFixed(0)
        )
      : formatNumberWithCommas(
          (
            calculateTotalBudget(filteredBudgets, currency.value) -
            parseFloat(cumulativeTotalExpenses)
          ).toFixed(2)
        );

  const calculateTotalAmountInKRWForFilteredExpenses = (expenses) => {
    const averageExchangeRates = calculateAverageExchangeRates(
      accountBook.budgets
    );

    const totalAmount = expenses.reduce((total, expense) => {
      const exchangeRate = averageExchangeRates[expense.curUnit] || 1;
      return total + expense.amount * exchangeRate;
    }, 0);

    return Math.round(totalAmount);
  };

  const totalAmountInKRWForFilteredExpenses =
    selectedDate !== 'all' &&
    selectedDate !== 'preparation' &&
    selectedDate !== 'after'
      ? calculateTotalAmountInKRWForFilteredExpenses(filteredExpenses)
      : totalExpensesInKRW;

  return (
    <>
      <div className={styles.expenseList_container}>
        <div className={styles.expenseList_header}>
          <div className={styles.expenseList_buttons}>
            <div className={styles.filter_buttons}>
              <Button
                className={filter === 'all' ? styles.selected_button : ''}
                onClick={() => handleFilterChange('all')}
              >
                모두보기
              </Button>
              <Button
                className={filter === 'shared' ? styles.selected_button : ''}
                onClick={() => handleFilterChange('shared')}
              >
                공동경비
              </Button>
              <Button
                className={filter === 'personal' ? styles.selected_button : ''}
                onClick={() => handleFilterChange('personal')}
              >
                개인경비
              </Button>
            </div>

            <div className={styles.settlement_button}>
              {filter === 'all' ? (
                <Button onClick={goExport}>내보내기</Button>
              ) : filter === 'shared' ? (
                <Button onClick={goSettlement}>정산하기</Button>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className={styles.expenseList_summary_container}>
            <div className={styles.currencyAndTotalAmount}>
              <div className={styles.currency_select}>
                <label htmlFor="currency">화폐 :</label>
                <Select
                  id="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  options={[
                    { label: '전체', value: 'all' },
                    ...uniqueCurrencies,
                  ]}
                  styles={selectStyles}
                  isSearchable={false}
                  noOptionsMessage={() => '선택 가능한 화폐가 없습니다'}
                />
              </div>
              <div className={styles.totalAmount_container}>
                <div className={styles.totalAmount_label}>지출 합계 :</div>
                <div className={styles.totalAmount}>
                  {currency.value === 'all' || currency.value === 'KRW' ? (
                    ''
                  ) : (
                    <>
                      <div className={styles.amountCurrency}>
                        ({currency.value}{' '}
                        {formatNumberWithCommas(
                          totalExpensesInSelectedCurrency.toFixed(2)
                        )}
                        )
                      </div>
                    </>
                  )}
                  <div className={styles.amountKRW}>
                    {formatNumberWithCommas(
                      totalAmountInKRWForFilteredExpenses
                    )}{' '}
                    원<label>** 원화 환산 금액</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.expenseList_summary}>
              <span className={styles.summaryInfo}>
                <label>총 예산</label> {fomattedTotalBudget}
              </span>
              <span className={styles.summaryInfo}>
                <label>누적 지출</label> {formattedCumulativeTotalExpenses}
              </span>
              <span className={styles.summaryInfo}>
                <label>잔액</label> {remainingBudget}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.expenseList}>
          {Object.keys(groupedExpenses).length === 0 ? (
            <p className={styles.noExpenses}>
              아직 등록된 지출내역이 없어요 😅
            </p>
          ) : (
            Object.keys(groupedExpenses).map((date, index) => (
              <div key={index}>
                <div className={styles.expenseDate}>{date}</div>
                {groupedExpenses[date].map((expense, idx) => (
                  <ExpenseItem
                    key={idx}
                    expense={expense}
                    accountBook={accountBook}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      {isExportModalOpen && (
        <ExportAccountBook
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          id={accountBook.id}
          countryName={accountBook.countryName}
          title={accountBook.title}
        />
      )}
    </>
  );
};

export default ExpenseList;
