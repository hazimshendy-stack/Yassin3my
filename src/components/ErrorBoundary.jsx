import { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button.jsx';
import { logger } from '../lib/logger.js';
import './ErrorBoundary.module.css';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    logger.error('ErrorBoundary caught', error, info?.componentStack);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="eb">
        <div className="eb__panel" role="alert">
          <div className="eb__icon">
            <AlertCircle size={22} />
          </div>
          <h2 className="eb__title">حدث خطأ غير متوقع</h2>
          <p className="eb__msg">{String(this.state.error.message || this.state.error)}</p>
          <div className="eb__actions">
            <Button
              variant="outline"
              leftIcon={<RotateCcw size={14} />}
              onClick={() => {
                this.reset();
                if (this.props.onReset) this.props.onReset();
              }}
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
