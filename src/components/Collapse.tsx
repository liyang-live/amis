/**
 * @file Collapse
 * @description
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import css = require('dom-helpers/style');
import {ClassNamesFn, themeable} from '../theme';
import Transition, { EXITED, ENTERED, ENTERING, EXITING } from 'react-transition-group/Transition';
import { autobind } from '../utils/helper';

const collapseStyles: {
    [propName: string]: string;
} = {
    [EXITED]: 'collapse',
    [EXITING]: 'collapsing',
    [ENTERING]: 'collapsing',
    [ENTERED]: 'collapse show',
};

export interface CollapseProps  {
    show?: boolean,
    mountOnEnter?: boolean,
    unmountOnExit?: boolean,
    className?: string,
    classPrefix: string;
    classnames: ClassNamesFn;
}

export class Collapse extends React.Component<CollapseProps, any> {
    static defaultProps: Pick<
        CollapseProps,
        'show' | 'mountOnEnter' | 'unmountOnExit'
    > = {
        show: false,
        mountOnEnter: false,
        unmountOnExit: false
    }

    contentDom: any;
    contentRef = (ref: any) => (this.contentDom = ref);

    @autobind
    handleEnter(elem: HTMLElement) {
        elem.style['height'] = null;
    }

    @autobind
    handleEntering(elem: HTMLElement) {
        elem.style['height'] = `${elem['scrollHeight']}px`;
    }

    @autobind
    handleEntered(elem: HTMLElement) {
        elem.style['height'] = null;
    }

    @autobind
    handleExit(elem: HTMLElement) {
        let offsetHeight = elem['offsetHeight'];
        const height = offsetHeight + parseInt(css(elem, 'marginTop'), 10) + parseInt(css(elem, 'marginBottom'), 10);
        elem.style['height'] = `${height}px`;

        // trigger browser reflow
        elem.offsetHeight;
    }

    @autobind
    handleExiting(elem: HTMLElement) {
        elem.style['height'] = null;
    }

    render() {
        const {
            show,
            children,
            mountOnEnter,
            unmountOnExit
        } = this.props;

        return (
            <Transition
                mountOnEnter={mountOnEnter}
                unmountOnExit={unmountOnExit}
                in={show}
                timeout={300}
                onEnter={this.handleEnter}
                onEntering={this.handleEntering}
                onEntered={this.handleEntered}
                onExit={this.handleExit}
                onExiting={this.handleExiting}
            >
                {(status:string, innerProps:any) => {
                    if (status === ENTERING) {
                        this.contentDom.offsetWidth;
                    }
                    return React.cloneElement(children as any, {
                        ...innerProps,
                        ref: this.contentRef,
                        className: cx(
                            collapseStyles[status],
                            innerProps.className
                        )
                    })}
                }
            </Transition>
        );
    }
}

export default themeable(Collapse);