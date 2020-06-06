import { Button, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { emailLinkSignIn } from './firebase';
import { LinkParts } from './types';

const InitiateLogin: React.SFC<{
  onCompletion: (success: boolean) => void;
}> = ({ onCompletion }) => {
  const [email, setEmail] = useState('');
  return (
    <Card className="card">
      <TextField
        className="field"
        type="email"
        label="Email"
        name="email"
        id="email"
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        color="primary"
        variant="contained"
        onClick={() => emailLinkSignIn(email).then(onCompletion)}
      >
        Log In
      </Button>
    </Card>
  );
};

export const CheckEmail: React.SFC<{}> = () => {
  return <Typography>A login link has been sent to your email.</Typography>;
};

export const SaveLink: React.SFC<LinkParts> = () => {
  const [finishedSignIn, setFinishedSignIn] = useState(false);
  if (finishedSignIn) {
    return <CheckEmail />;
  }
  return <InitiateLogin onCompletion={setFinishedSignIn} />;
};
