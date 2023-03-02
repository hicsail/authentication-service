import { Box, Button } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../context/auth.context';
import { useProjectUsersQuery } from '../graphql/user/user';
import { useForgotPasswordMutation } from '../graphql/auth/auth';

export const Users = () => {
  const { token, decoded_token, setToken } = useAuth();
  const projectId = decoded_token['projectId'];
  const [forgotPassword, { data: passwordData, error: passwordError }] = useForgotPasswordMutation();
  const {
    data: usersData,
    called,
    loading
  } = useProjectUsersQuery({
    variables: {
      projectId
    }
  });

  const handleResetPassword = async (email: string) => {
    await forgotPassword({ variables: { email, projectId: projectId || '' } });
    if (passwordData && passwordData.forgotPassword) {
      window.alert('Password reset link sent to email!');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'updatePassword',
      headerName: 'Update Password',
      width: 180,
      renderCell: (params) => (
        <Button variant="contained" size="small" onClick={() => handleResetPassword(params.row.email)}>
          Update Password
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={usersData?.projectUsers || []} columns={columns} />
    </Box>
  );
};
