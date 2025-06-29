import React from 'react';

export const Loader = () => <div style={{ textAlign: 'center' }}>Loading…</div>;
export const ErrorMessage = ({ msg }: { msg: string }) => (
  <div style={{ color: 'red', textAlign: 'center' }}>Error: {msg}</div>
);