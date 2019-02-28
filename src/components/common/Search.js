import React from 'react';
import { withRouter } from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../../helpers';
import Loading from './Loading';
import '../common/search.css';


class Search extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.hanldeRedirect = this.hanldeRedirect.bind(this);

        this.state = {
            searchResults: [],
            searchQuery: '',
            loading: false,
        };
    }


 
    handleChange(event) {
        const searchQuery = event.target.value;

        this.setState({ searchQuery: searchQuery });

        //If searchQuery is not present, dont send request to server
        if (!searchQuery) {
            return '';
        }
        this.setState({ loading: true })
        fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
            .then(handleResponse)
            .then((result) => {
                this.setState({
                    loading: false,
                    searchResults: result,

                })

            });

        console.log(this.state);

    }

    hanldeRedirect(currencyId){

        //clear input value and close autocomplete container,
        //By clearing searchQuery state
        this.setState({
            searchQuery: '',
            searchResults: [],
        });

        this.props.history.push(`/currency/${currencyId}`)
    }
    renderSearchResults() {
        const { searchResults, searchQuery, loading } = this.state;

        if(!searchQuery){
            return '';
        }

        if (searchResults.length > 0) {
            return (
                <div className="Search-result-container">
                    {searchResults.map(result => (
                        <div
                            key={result.id}
                            className="Search-result"
                            onClick={() => this.hanldeRedirect(result.id)}
                        >
                            {result.name} ({result.symbol})
                    </div>
                    ))}
                </div>
            )
        }

        if(!loading){
        return (
            <div className="Search-result-container">
                <div className="Search-no-result">
                    No results found.
                        </div>
            </div>
        )
        }
    }

    render() {
        const { loading, searchQuery} = this.state; 
        return (
            //Con varios inputs se le pone un name=NOMBRE y en handleChange se iguala a un valor CLASE 11
            <div className="Search">
                <span className="Search-icon" />
                <input className="Search-input"
                    type="text"
                    placeholder="Currency name"
                    onChange={this.handleChange}
                    value={searchQuery} />
                {loading &&
                    <div className="Search-loading" >
                        <Loading
                            width='12px'
                            height='12px' />
                    </div>
                }
                {this.renderSearchResults()}
            </div>

        );
    }
}

export default withRouter(Search);