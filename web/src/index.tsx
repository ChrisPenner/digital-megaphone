import React, { useState } from 'react';
import { render } from 'react-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const SimpleInput: React.SFC<{
  name: string;
  id: string;
  setter: (s: string) => void;
}> = ({ name, id, setter }) => (
  <label>
    {name}
    <input
      type="text"
      name={id}
      id={id}
      placeholder={name}
      onChange={(e) => setter(e.target.value)}
    />
  </label>
);

interface LinkParts {
  recipient: string;
  subject: string;
  body: string;
  /* bcc: string; */
}

const buildLink: (parts: LinkParts) => string = ({
  recipient,
  body,
  subject,
  /* bcc, */
}) =>
  `mailto:${recipient}?subject=${encodeURIComponent(
    subject || ''
  )}&body=${encodeURIComponent(body || '')}`;

const EmailLink: React.SFC<LinkParts> = (linkParts) => {
  const link = buildLink(linkParts);
  return (
    <div>
      <a href={link}> Test </a>
      <CopyToClipboard
        text={link}
        onCopy={() => alert('Copied link to your clipboard')}
      >
        <button>Copy</button>
      </CopyToClipboard>
    </div>
  );
};

const Application: React.SFC<{}> = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  /* const [bcc, setBCC] = useState(''); */
  return (
    <div>
      <h1>Digital Megaphone</h1>
      <form>
        <SimpleInput
          name="Primary Recipient"
          id="recipient"
          setter={setRecipient}
        />
        <SimpleInput name="Subject" id="subject" setter={setSubject} />
        {/* <SimpleInput name="BCC" id="bcc" setter={setBCC} /> */}
        <SimpleInput name="Body" id="body" setter={setBody} />
        <EmailLink
          recipient={recipient}
          subject={subject}
          body={body}
          // bcc={bcc}
        />
      </form>
    </div>
  );
};

render(<Application />, document.getElementById('root'));
