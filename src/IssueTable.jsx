import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class IssueRowPlain extends React.Component {
    render() {
        const {
            issue,
            location: { search },
            closeIssue,
            deleteIssue,
            index,
        } = this.props;
        const user = this.context;
        const disabled = !user.signedIn;

        const selectLocataion = { pathname: `/issues/${issue.id}`, search };

        const editTooltip = (
            <Tooltip id="close-tooltip">Edit Issue</Tooltip>
        );
        const closeTooltip = (
            <Tooltip id="close-tooltip">Close Issue</Tooltip>
        );
        const deleteTooltip = (
            <Tooltip id="delete-tooltip">Delete Issue</Tooltip>
        );

        function onClose(e) {
            e.preventDefault();
            closeIssue(index);
        }
        function onDelete(e) {
            e.preventDefault();
            deleteIssue(index);
        }
        const tableRow = (
            <tr>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.effort}</td>
                <td>{issue.due ? issue.due.toDateString() : ' - '}</td>
                <td>{issue.title}</td>
                <td>
                    <LinkContainer to={`/edit/${issue.id}`}>
                        <OverlayTrigger delayShow={1000} placement="top" overlay={editTooltip}>
                            <Button bsSize="small">
                                <Glyphicon glyph="edit" />
                            </Button>
                        </OverlayTrigger>
                    </LinkContainer>
                    {' '}
                    <OverlayTrigger delayShow={1000} overlay={closeTooltip} placement="top">
                        <Button disabled={disabled} bsSize="small" onClick={onClose}>
                            <Glyphicon glyph="remove" />
                        </Button>
                    </OverlayTrigger>
                    {' '}
                    <OverlayTrigger delayShow={1000} overlay={deleteTooltip} placement="top">
                        <Button disabled={disabled} bsSize="small" onClick={onDelete}>
                            <Glyphicon glyph="trash" />
                        </Button>
                    </OverlayTrigger>
                </td>
            </tr>
        );

        return (
            <LinkContainer to={selectLocataion}>
                {tableRow}
            </LinkContainer>
        );
    }
}

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

export default function IssueTable({ isIssues, closeIssue, deleteIssue }) {
    const issueRows = isIssues.map((issue, index) => (
        <IssueRow
            key={issue.id}
            issue={issue}
            closeIssue={closeIssue}
            deleteIssue={deleteIssue}
            index={index}
        />
    ));
    return ( // style={{ borderCollapse: 'collapse' }} border={5}
        <Table bordered condensed hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Due Date</th>
                    <th>Title</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </Table>
    );
}
