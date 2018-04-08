import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from 'admin-on-rest';
import { getReferencesByIds } from 'admin-on-rest';

export class ArrayField extends Component {
    componentDidMount() {
        this.fetchReferences();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferences(nextProps);
        }
    }

    fetchReferences({ crudGetManyAccumulate, reference, ids } = this.props) {
        crudGetManyAccumulate(reference, ids);
    }

    render() {
        const { resource, reference, data, ids, children, basePath } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error(
                '<ArrayField> only accepts a single child (like <Datagrid>)'
            );
        }

        if (ids.length !== 0 && Object.keys(data).length !== ids.length) {
            return <LinearProgress style={{ marginTop: '1em' }} />;
        }

        const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
        return React.cloneElement(children, {
            resource: reference,
            ids,
            data,
            basePath: referenceBasePath
        });
    }
}

ArrayField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    data: PropTypes.object,
    ids: PropTypes.array.isRequired,
    label: PropTypes.string,
    record: PropTypes.object.isRequired,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => {
    const { record, source, reference } = props;
    const records = get(record, source);
    const ids = records.map(i => i.id);
    console.log(getReferencesByIds);
    return {
        ids,
        data: getReferencesByIds(state, reference, ids)
    };
};

const ConnectedArrayField = connect(mapStateToProps, {
    crudGetManyAccumulate: crudGetManyAccumulateAction
})(ArrayField);

ConnectedArrayField.defaultProps = {
    addLabel: true
};

export default ConnectedArrayField;
