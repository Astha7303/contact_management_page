import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import { Box, ThemeProvider } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <Box >
      <ThemeProvider theme={theme}>
        <Sidebar />
      </ThemeProvider>
    </Box>
  );
}

export default App;
