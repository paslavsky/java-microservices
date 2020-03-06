import React from 'react';
import {Link} from "react-router-dom";

const DocLink = (props) => (
    <Link to={props.href}>{props.title || props.children}</Link>
);

export default DocLink;
