// Pages/Home/EventOverlay.jsx
import React from "react";
import styled from "@emotion/styled";
import { Box, Typography, Button, Zoom } from "@mui/material";

const Overlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background: rgba(15, 23, 42, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

export const EventOverlay = ({ event, onConfirm }) => {
  if (!event) return null;

  return (
    <Overlay>
      <Zoom in={true}>
        <Box>
          <Typography sx={{ fontSize: "80px", mb: 2 }}>{event.icon}</Typography>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 900, mb: 1 }}
          >
            {event.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: event.color, fontWeight: 700, mb: 3 }}
          >
            {event.description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onConfirm}
            sx={{
              bgcolor: event.color,
              borderRadius: "12px",
              px: 4,
              py: 2,
              "&:hover": { bgcolor: event.color, opacity: 0.9 },
            }}
          >
            Понятно
          </Button>
        </Box>
      </Zoom>
    </Overlay>
  );
};
