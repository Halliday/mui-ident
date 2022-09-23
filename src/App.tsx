import { Box, Paper } from '@mui/material';
import { LoginPanel } from './components/Login';
import { MyProfilePanel } from './components/Profile';
import { useSession } from './session';

function App() {

  const { session } = useSession();

  let content: JSX.Element;
  if (session) {

    content = <>
      <Paper sx={{ width: 350, position: "relative" }}>
        <MyProfilePanel />
      </Paper>
    </>
  } else {

    content = <>
      <Paper sx={{ width: 350, position: "relative" }}>
        <LoginPanel />
      </Paper>
    </>
  }

  return (
    <Box sx={{ display: "flex", minHeight: "80%", flexDirection: "column", alignItems: "center", boxSizing: "border-box", justifyContent: "center" }}>
      {content}
    </Box>
  );
}

export default App;
