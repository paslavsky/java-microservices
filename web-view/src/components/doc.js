import React from 'react';
import {connect} from 'react-redux';
import {fetchDoc} from "../actions";
import {Card} from "primereact/card";
import {ProgressSpinner} from "primereact/progressspinner";
import {ScrollPanel} from "primereact/scrollpanel";
import Markdown from "markdown-to-jsx";
import DocLink from "./doc-link";

const TOC_DOC = 'toc.md';

class Doc extends React.Component {

    componentDidMount() {
        this.fetch();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetch();
    }

    fetch() {
        if (!this.props.doc) {
            this.props.fetchDoc(this.props.match.params.doc);
        } else if (this.props.doc.error) {
            this.props.history.push('/404')
        }

        if (!this.props.toc) {
            this.props.fetchDoc(TOC_DOC)
        } else if (this.props.toc.error) {
            this.props.history.push('/404')
        }
    }

    render() {
        const mdOptions = {
            overrides: {
                a: {
                    component: DocLink
                },
            },
        };
        return (
            <div className="p-grid">
                <div className="p-sm-12 p-md-12 p-lg-4 p-xl-3" style={{paddingTop: '5em'}}>
                    <div className="p-grid p-justify-around">
                        <Card style={{width: '280px'}}>
                            {
                                this.props.toc && this.props.toc.content ? (
                                    <Markdown options={mdOptions}>
                                        {this.props.toc.content}
                                    </Markdown>
                                ) : (<ProgressSpinner/>)
                            }
                        </Card>
                    </div>
                </div>
                <div className="p-sm-12 p-md-12 p-lg-8 p-xl-6">
                    <ScrollPanel style={{width: '100%', height: 'calc(100vh - 5.1em)', paddingTop: '5em'}}>
                        <Card>
                            {
                                this.props.doc && this.props.doc.content ? (
                                    <Markdown options={mdOptions}>
                                        {this.props.doc.content}
                                    </Markdown>
                                ) : (<ProgressSpinner/>)
                            }
                        </Card>
                    </ScrollPanel>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    doc: state.docs[ownProps.match.params.doc],
    toc: state.docs[TOC_DOC]
});


export default connect(
    mapStateToProps, {fetchDoc}
)(Doc);
