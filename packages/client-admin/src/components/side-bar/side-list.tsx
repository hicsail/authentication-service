import React, { FC, useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

export interface SideListProps {
  children: React.ReactNode;
}

export const SideList: FC<SideListProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [selected, setSelected] = React.useState(pathname);

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <TreeView
      selected={selected}
      defaultCollapseIcon={<FontAwesomeIcon icon={faCaretDown} />}
      defaultExpandIcon={<FontAwesomeIcon icon={faCaretUp} />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {children}
    </TreeView>
  );
};
