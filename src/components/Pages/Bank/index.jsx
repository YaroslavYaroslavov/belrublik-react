import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  Stack,
  Box,
} from "@mui/material";
import { BankContainer, BankCard, StatBox } from "./styles";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningIcon from "@mui/icons-material/Warning";

export const Bank = ({ userStats, bankData, onBankAction }) => {
  const { balance, day } = userStats;
  const [amount, setAmount] = useState("");

  // Расчет максимального кредита (40% от дохода за 3 дня)
  const threeDayIncome = bankData.historyIncome
    .slice(-3)
    .reduce((a, b) => a + b, 0);
  const maxLoan = Math.floor(threeDayIncome * 0.4);
  const canTakeLoan = day >= 3 && bankData.loan === 0;

  // Проверка возможности забрать депозит (через 7 дней)
  const canWithdrawDeposit =
    bankData.depositDate && day - bankData.depositDate >= 7;
  const daysUntilWithdraw = bankData.depositDate
    ? 7 - (day - bankData.depositDate)
    : 0;

  const handleAction = (type) => {
    const val = parseInt(amount);
    if (isNaN(val) || val <= 0) return;
    onBankAction(type, val);
    setAmount("");
  };

  return (
    <BankContainer>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
        Центральный Банк
      </Typography>

      {/* Секция Депозита */}
      <BankCard type="deposit" elevation={0}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AccountBalanceIcon color="success" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Сберегательный счет
          </Typography>
        </Stack>

        <StatBox>
          <Typography color="text.secondary">Ваш вклад:</Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {bankData.deposit} USD
          </Typography>
        </StatBox>

        <Typography
          variant="caption"
          display="block"
          sx={{ mb: 2, color: "#16a34a" }}
        >
          +5% ежедневно. Вывод доступен через 7 дней.
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Сумма вклада"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2, bgcolor: "#fff" }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            disabled={balance < parseInt(amount) || !amount}
            onClick={() => handleAction("DEPOSIT_ADD")}
          >
            Вложить
          </Button>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            disabled={bankData.deposit <= 0 || !canWithdrawDeposit}
            onClick={() => handleAction("DEPOSIT_WITHDRAW")}
          >
            {canWithdrawDeposit
              ? "Забрать всё"
              : `Ждать ${daysUntilWithdraw}д.`}
          </Button>
        </Stack>
      </BankCard>

      {/* Секция Кредита */}
      <BankCard type="loan" elevation={0}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <PaymentsIcon color="error" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Кредитная линия
          </Typography>
        </Stack>

        {bankData.loan > 0 ? (
          <Box>
            <StatBox>
              <Typography color="text.secondary">Долг:</Typography>
              <Typography variant="h6" color="error" sx={{ fontWeight: 900 }}>
                {bankData.loan + bankData.loanPenalty} USD
              </Typography>
            </StatBox>
            {bankData.loanPenalty > 0 && (
              <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 2 }}>
                Начислена пеня за просрочку!
              </Alert>
            )}
            <Button
              variant="contained"
              color="error"
              fullWidth
              disabled={balance < bankData.loan + bankData.loanPenalty}
              onClick={() => handleAction("LOAN_REPAY")}
            >
              Погасить полностью
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Доступный лимит: <strong>{maxLoan} USD</strong>
            </Typography>
            {day < 3 ? (
              <Alert severity="info">Кредит доступен с 3-го дня работы.</Alert>
            ) : (
              <Button
                variant="contained"
                color="error"
                fullWidth
                disabled={maxLoan <= 0}
                onClick={() => onBankAction("LOAN_TAKE", maxLoan)}
              >
                Взять {maxLoan} USD
              </Button>
            )}
          </Box>
        )}
      </BankCard>
    </BankContainer>
  );
};
