import * as React from "react";
import * as PropTypes from "prop-types";

import vendors from "../common/browser/vendors";
const vendorPrefixes: string[] = vendors.map(str => str ? `-${str}-` : str);

export interface DataProps {
  /**
   * Set progress value. `(0 <= value <=1)`
   */
  defaultProgressValue?: number;
  /**
   * Set ProgressBar to indeterminate model.
   */
  isIndeterminate?: boolean;
  /**
   * Set ProgressBar width.
   */
  barWidth?: number;
  /**
   * Set ProgressBar height.
   */
  barHeight?: number;
  /**
   * Set ProgressBar animation speed.
   */
  speed?: number;
}

export interface ProgressBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ProgressBarState {}

export class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {
  static defaultProps: ProgressBarProps = {
    speed: 4000,
    barWidth: 320,
    barHeight: 4,
    isIndeterminate: false,
    defaultProgressValue: 0.5
  };

  state: ProgressBarState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  getOnlyClassName = () => {
    const { speed } = this.props;
    return `react-uwp-progress-bar_${speed}`;
  }

  getInnerCSS = (className?: string) => {
    const { speed, barHeight, barWidth } = this.props;
    return (
`.${className} {
}
${Array(5).fill(0).map((name, index) => (
  [`.${className}-item-` + index + " {",
  vendorPrefixes.map(str => (`    ${str}animation: ProgressBar ${speed}ms ${index * barHeight * barWidth * speed / 5 / 10e3}ms cubic-bezier(0.25, 0.75, 0.75, 0.25) infinite normal forwards;`)).join("\n"),
  "  }"].join("")
)).join("")}

${vendorPrefixes.map(str => `@${str}keyframes ProgressBar {
  0% {
    left: -${barHeight}px;
  }
  15% {
    left: -${barHeight}px;
  }
  85% {
    left: ${barWidth + barHeight}px;
  }
  100% {
    left: ${barWidth + barHeight}px;
  }
}`)}.join("")`);
  }

  render() {
    const {
      defaultProgressValue,
      isIndeterminate,
      speed,
      barWidth,
      barHeight,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const className = this.getOnlyClassName();

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <style type="text/css" dangerouslySetInnerHTML={{ __html: this.getInnerCSS(className) }} />
        <div style={styles.bar}>
          {isIndeterminate ? Array(5).fill(0).map((numb, index) => (
            <div
              key={`${index}`}
              className={`${className}-item-${index}`}
              style={theme.prepareStyles({
                background: theme.listAccentHigh,
                position: "absolute",
                top: 0,
                left: -barHeight,
                width: barHeight,
                height: barHeight,
                borderRadius: barHeight
              })}
            />
          )) : null}
        </div>
      </div>
    );
  }
}

function getStyles(progressBar: ProgressBar): {
  root?: React.CSSProperties;
  bar?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, barWidth, barHeight, isIndeterminate, defaultProgressValue }
  } = progressBar;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      display: "inline-block",
      verticalAlign: "middle",
      background: isIndeterminate ? void 0 : theme.chromeLow,
      overflow: "hidden",
      width: barWidth,
      height: barHeight,
      ...style
    }),
    bar: prepareStyles({
      overflow: "hidden",
      background: isIndeterminate ? void 0 : theme.accent,
      position: "relative",
      width: "100%",
      height: "100%",
      transform: isIndeterminate ? void 0 : `translate3d(-${(1 - defaultProgressValue) * 100}%, 0, 0)`
    })
  };
}

export default ProgressBar;
