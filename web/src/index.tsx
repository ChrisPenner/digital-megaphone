import React, { useState } from 'react';
import { render } from 'react-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import FileCopy from '@material-ui/icons/FileCopyOutlined';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import {
  Grid,
  Button,
  Typography,
  Card,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';

const SimpleInput: React.SFC<{
  name: string;
  id: string;
  setter: (s: string) => void;
  required?: boolean;
  multiline?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  value: string;
}> = ({ name, id, setter, required, multiline, ...rest }) => (
  <TextField
    className="field"
    type="text"
    name={id}
    label={name}
    id={id}
    onChange={(e) => setter(e.target.value)}
    variant="outlined"
    required={required}
    multiline={multiline}
    rows={multiline ? 10 : 0}
    {...rest}
  />
);

interface LinkParts {
  recipient: string;
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

const buildLink: (parts: LinkParts) => string = ({
  recipient,
  body,
  subject,
  bcc = [],
  cc = [],
}) =>
  `mailto:${encodeURIComponent(recipient || '')}?subject=${encodeURIComponent(
    subject || ''
  )}&body=${encodeURIComponent(body || '')}&bcc=${encodeURIComponent(
    bcc.join('; ')
  )}&cc=${encodeURIComponent(cc.join('; '))}`;

const Application: React.SFC<{}> = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [bcc, setBCC] = useState([] as string[]);
  const [cc, setCC] = useState([] as string[]);
  const link = buildLink({ recipient, subject, body, bcc, cc });
  return (
    <Card className="card">
      <Grid
        className="main-grid"
        container
        spacing={2}
        alignItems="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Typography variant="h2">Digital Megaphone</Typography>
        </Grid>
        <Grid item xs={12} className="full-width">
          <ExpansionPanel>
            <ExpansionPanelSummary color="primary" expandIcon={<ExpandMore />}>
              <Typography> What's this for? </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                This is a tool for helping to construct shareable links, which
                when clicked open an e-mail app with the full email pre-filled
                with a useful starting point.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} className="full-width">
          <SimpleInput
            name="Primary Recipient"
            placeholder="recipient@example.com"
            id="recipient"
            setter={setRecipient}
            required
            helperText={subject ? '' : 'A recipient is required'}
            error={!recipient}
            value={recipient}
          />
        </Grid>
        <Grid item className="full-width">
          <ChipInput
            newChipKeys={['Enter', ',', ';', ' ']}
            onChange={(chips) => setCC(chips)}
            className="field"
            id="cc"
            label="CC"
            variant="outlined"
            placeholder="cc-recipient@example.com"
          ></ChipInput>
        </Grid>
        <Grid item className="full-width">
          <ChipInput
            newChipKeys={['Enter', ',', ';', ' ']}
            onChange={(chips) => setBCC(chips)}
            className="field"
            id="bcc"
            label="BCC"
            variant="outlined"
            placeholder="bcc-recipient@example.com"
          ></ChipInput>
        </Grid>
        <Grid item className="full-width">
          <SimpleInput
            name="Subject"
            id="subject"
            setter={setSubject}
            error={!subject}
            helperText={subject ? '' : 'A subject is required'}
            required
            value={subject}
            placeholder="What's your email about?"
          />
        </Grid>
        <Grid item className="full-width">
          <SimpleInput
            value={body}
            name="Body"
            id="body"
            setter={setBody}
            placeholder="Type your message here..."
            multiline
          />
        </Grid>
        <div className="actions">
          <div className="action-row">
            <a href={link}>
              <Button className="test" variant="contained" color="primary">
                Test Link{' '}
              </Button>
            </a>
            <CopyToClipboard
              text={link}
              onCopy={() => alert('Copied link to your clipboard')}
            >
              <Button
                className="copy-to-clipboard"
                variant="outlined"
                color="secondary"
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>Copy to Clipboard</Grid>
                  <Grid item>
                    <FileCopy />
                  </Grid>
                </Grid>
              </Button>
            </CopyToClipboard>
          </div>
          <div className="action-row">
            <code>{link}</code>
          </div>
        </div>
      </Grid>
    </Card>
  );
};

render(<Application />, document.getElementById('root'));
