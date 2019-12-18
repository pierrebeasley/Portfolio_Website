import React from "react";
import {SegmentedControl} from "../Background/SegmentedControl/SegmentedControl";
import {ProjectItem} from "./ProjectItem";
import './ProjectsPage.css';
import mountain from '../../img/abstract_mountain.svg';
import {ToolsPage} from "./Tools/ToolsPage";

export class ProjectsPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            selected_language: 0,
            project_items: [],
            visible_items: [],
            types: [],
        }
    }

    selectionChanged(index) {
        this.setState({
            selected_language: index,
            project_items: this.state.project_items,
            types: this.state.types,
            visible_items: this.get_visible_projects_of_type(this.state.types[index], this.state.project_items),
        })
    }

    get_project_types(project_items) {
        let types = ['All'];
        for (let i = 0; i < project_items.length; i++) {
            if (!types.includes(project_items[i].type))
                types.push(project_items[i].type);
        }
        return types;
    }

    get_visible_projects_of_type(type, project_items) {
        if (type === 'All') return project_items;
        let visible = [];
        for (let i = 0; i < project_items.length; i++) {
            if (project_items[i].type === type) {
                visible.push(project_items[i]);
            }
        }
        return visible;
    }

    componentDidMount() {
        //http://127.0.0.1:8080?prop_type=programming
        fetch("http://ec2-3-19-185-142.us-east-2.compute.amazonaws.com/index.php?prop_type=programming", {
            method: 'GET',
        })
            .then(res => res.json())
            .then(
                (result) => {
                    const types = this.get_project_types(result);
                    const visible_projects = this.get_visible_projects_of_type(types[this.state.selected_language], result);
                    this.setState({
                        types: types,
                        project_items: result,
                        visible_items: visible_projects,
                        selected_language: this.state.selected_language,
                    });
                },
                (error) => {
                    this.setState({
                        types: [],
                        project_items: [],
                        visible_items: [],
                        selected_language: this.state.selected_language,
                    });
                    console.log(error);
                }
            )
    }

    // layout_card(items) {
    //     let groups = [];
    //     const num_columns = 4;
    //     const num_rows = items.length / num_columns;
    //     for (let i = 0; i < num_rows; i++) {
    //         const group = [
    //             <div className={'card-group programming-experience-display-container'}>
    //                 {
    //                     items.slice(i * num_columns, (i + 1) * num_columns).map((item, key) =>
    //                         <ProjectItem item={item} key={key} />
    //                     )
    //                 }
    //             </div>
    //         ];
    //         groups.push(group);
    //     }
    //     return groups;
    // }

    render() {
        return <div className={'projects-page-container'}>
            <h1 className={'section-title programming-experience-title'}>Programming Experience</h1>
            <p className={'section-subtitle col-lg-6 offset-lg-3 programming-experience-description'}>I like to explore how building connections between particular technologies can bring surprising results. I have come up with a few personal projects. </p>
            {/*<SegmentedControl items ={this.state.types} selected_item={this.state.selected_language} onSelect={this.selectionChanged.bind(this)} />*/}
            <div className={'display-container'}>
                <div className={'card-columns programming-experience-display-container'}>
                    {
                        this.state.visible_items.map((item, i) =>
                            <ProjectItem item={item} key={i} />
                        )
                    }
                </div>
                {/*{groups}*/}
            </div>
            <ToolsPage />
        </div>
    }

}
