import { Box, Button } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth.context';
import { useProjectUsersQuery } from '../graphql/user/user';
import jwt_decode from 'jwt-decode';
import { useForgotPasswordMutation } from '../graphql/auth/auth';

export const Users = () => {
  const [users, setUsers] = useState<any>();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const { token, setToken } = useAuth();
  const decoded: any = jwt_decode(token.token);
  const projectId = decoded['projectId'];
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

  useEffect(() => {
    if (usersData && usersData.projectUsers) {
      setUsers(usersData.projectUsers);
    }
  }, [usersData]);

  useEffect(() => {
    if (users) {
      const rows: any = [];
      users.forEach((user: any) => {
        rows.push({ id: user.id, email: user.email, username: user.username, role: user.role });
      });
      setRows(rows);
    }
  }, [users]);

  const handleDelete = async (email: string) => {
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
        <Button variant="contained" size="small" onClick={() => handleDelete(params.row.email)}>
          Update Password
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};
