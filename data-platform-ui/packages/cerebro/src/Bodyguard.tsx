import React from 'react';
import {appBootstrap, NLSSUser} from '@nlss/brain-trust';

type State = {
    loaded: boolean;
    userName: string;
};

class Bodyguard extends React.PureComponent<Bodyguard.Props, State> {
    static displayName = 'NLSSBodyguard';

    state: State = {
        loaded: false,
        userName: ''
    };

    async componentDidMount() {
        const user: NLSSUser | undefined = await appBootstrap();
        if (user !== undefined) {
            this.setState({loaded: true, userName: user.firstName})
        }

    }

    render() {
        if (!this.state.loaded) {
            return null;
        }
        return this.props.children(this.state.userName);
    }
}

namespace Bodyguard {
    export interface Props {
        children: (userName: string) => React.ReactNode;
    }
}

export default Bodyguard;
