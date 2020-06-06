import React, { useEffect } from 'react';
import { Card } from '@material-ui/core';
import { Link } from './types';
import { links } from './firebase';
import Typography from '@material-ui/core/Typography';
export const Redirector: React.SFC<{}> = () => {
  useEffect(() => {
    (async function () {
      const linkID = window.location.pathname.slice(3);
      console.log(linkID);
      const snapshot = await links.doc(linkID).get();
      const link: Link = snapshot.data() as Link;
      window.location.replace(link.mailTo);
    })();
  });

  return (
    <div className="main">
      <Card className="card">
        <Typography>Loading...</Typography>
      </Card>
    </div>
  );
};
