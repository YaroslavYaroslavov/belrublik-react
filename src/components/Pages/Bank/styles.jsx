import styled from "@emotion/styled";
import { Box, Paper } from "@mui/material";

export const BankContainer = styled(Box)`
  width: 100%;
  min-height: calc(100vh - 134px);
  padding: 20px;
  box-sizing: border-box;
  background-color: #f1f5f9;
`;

export const BankCard = styled(Paper)`
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  background: ${(props) => (props.type === "loan" ? "#fff1f2" : "#f0fdf4")};
`;

export const StatBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
