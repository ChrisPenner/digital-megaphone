import React from 'react';
import { render } from 'react-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import FileCopy from '@material-ui/icons/FileCopyOutlined';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
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
import { useStickyState } from './helpers';
import { Link } from './types';

import { app, db, links } from './firebase';

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
  const [recipient, setRecipient] = useStickyState('', 'recipient');
  const [subject, setSubject] = useStickyState('', 'subject');
  const [body, setBody] = useStickyState('', 'body');
  const [bcc, setBCC] = useStickyState([] as string[], 'bcc');
  const [cc, setCC] = useStickyState([] as string[], 'cc');
  const link = buildLink({ recipient, subject, body, bcc, cc });
  const clearForm = () => {
    const confirmed = window.confirm('Reset the form?');
    if (!confirmed) {
      return;
    }
    setRecipient('');
    setSubject('');
    setBody('');
    setBCC([]);
    setCC([]);
  };
  return (
    <div className="main">
      <Card className="card">
        <Typography variant="h3">
          <div> Digital Megaphone</div>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => clearForm()}
          >
            Clear Form
          </Button>
        </Typography>
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
        <ChipInput
          newChipKeys={['Enter', ',', ';', ' ']}
          onChange={(chips) => setCC(chips)}
          className="field"
          id="cc"
          label="CC"
          variant="outlined"
          placeholder="cc-recipient@example.com"
        ></ChipInput>
        <ChipInput
          newChipKeys={['Enter', ',', ';', ' ']}
          onChange={(chips) => setBCC(chips)}
          className="field"
          id="bcc"
          label="BCC"
          variant="outlined"
          placeholder="bcc-recipient@example.com"
        ></ChipInput>
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
        <SimpleInput
          value={body}
          name="Body"
          id="body"
          setter={setBody}
          placeholder="Type your message here..."
          multiline
        />
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
                  <Grid item>Copy Link</Grid>
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
      </Card>
    </div>
  );
};

if (window.location.pathname.startsWith('/l/')) {
  const linkID = window.location.pathname.slice(3);
  console.log(linkID);
  links
    .doc(linkID)
    .get()
    .then((snapshot) => {
      const link: Link = snapshot.data() as Link;
      window.location.replace(link.mailTo);
    });
} else {
  render(<Application />, document.getElementById('root'));
}
