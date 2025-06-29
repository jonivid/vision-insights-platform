// src/components/common/ErrorBoundary.tsx
import React from "react";

interface State {
  hasError: boolean;
}
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error("Uncaught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          Something went wrong. Please try refreshing.
        </div>
      );
    }
    return this.props.children;
  }
}
