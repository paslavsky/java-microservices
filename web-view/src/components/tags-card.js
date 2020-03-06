import React from 'react';
import PropTypes from 'prop-types';
import {TagCloud} from 'react-tagcloud'
import {Card} from "primereact/card";
import _ from 'lodash'

const TagsCard = props => {
    const tags = [];
    _.flatMap(props.samples, (it) => it.tags).forEach(it => {
        let tag = _.find(tags, {value: it});
        if (!tag) {
            tag = {value: it, count: 0};
            tags.push(tag);
        }
        tag.count += 1;
    });

    return (
        <Card style={{width: '280px', marginTop: '10px'}}>
            <TagCloud
                minSize={12}
                maxSize={35}
                tags={tags}
            />
        </Card>
    );
};

TagsCard.propTypes = {
    samples: PropTypes.array
};

export default TagsCard;
