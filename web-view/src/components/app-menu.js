import React, {useState} from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {connect} from "react-redux";
import {Sidebar} from "primereact/sidebar";
import {Menu} from "primereact/menu";
import {useHistory} from "react-router-dom";

const AppMenu = (props) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const history = useHistory();
    const go2 = (url) => {
        return () => {
            history.push(url)
        }
    };

    const menuModel = [
        {
            label: 'Dashboard',
            icon: 'mdi pi-fw mdi-view-dashboard',
            command: go2('/')
        },
        ...props.samples.map(it => ({
            label: `${it.name} v${it.version}`,
            command: go2(`/${it.name}`),
            icon: 'pi pi-fw pi-angle-right'
        }))
    ];

    return (
        <>
            <Toolbar style={{position: 'fixed', top: 1, width: 'calc(100% - 2px)', left: 1, zIndex: 1000}}>
                <div className="p-toolbar-group-left">
                    <Button icon="mdi mdi-24 mdi-menu" className="p-button-secondary"
                            style={{marginRight: '.25em'}}
                            onClick={(e) => setSidebarVisible(true)}/>
                </div>
                <div className="p-toolbar-group-right">
                    <Button icon="mdi mdi-24 mdi-help" className="p-button-secondary"
                            style={{marginRight: '.25em'}}/>
                    <Button icon="mdi mdi-24 mdi-github-circle" className="p-button-secondary"/>
                </div>
            </Toolbar>

            <Sidebar visible={sidebarVisible}
                     onHide={(e) => setSidebarVisible(false)}
                     showCloseIcon={false}
            >
                <Menu style={{width: '100%', border: 'none'}} model={menuModel}/>
            </Sidebar>
        </>
    );
};

const mapStateToProps = state => {
    return {
        ghRelease: state.ghRelease,
        samples: state.metrics.map(it => ({
            name: it.name,
            version: it.version
        }))
    }
};

export default connect(mapStateToProps)(AppMenu);
