import React, { Component } from 'react';
import './App.scss';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';
import TutorialGalleryPage from './components/pages/TutorialGalleryPage/TutorialGalleryPage';
import TutorialPage from './components/pages/TutorialSinglePage/TutorialSinglePage';
import ITutorialObject from './interfaces/ITutorialObject';
import DeployPage from './components/pages/DeployPage/DeployPage';
import IPackageRegistryEntry from './interfaces/IPackageRegistryEntry';
import Fabric2Page from './components/pages/Fabric2Page/Fabric2Page';
import TransactionPage from './components/pages/TransactionPage/TransactionPage';
import ISmartContract from './interfaces/ISmartContract';
import IAssociatedTxdata from './interfaces/IAssociatedTxdata';
import IDataFileTransaction from './interfaces/IDataFileTransaction';
import ITransaction from './interfaces/ITransaction';
import IRepositoryObject from './interfaces/IRepositoryObject';
import SampleGalleryPage from './components/pages/SampleGalleryPage/SampleGalleryPage';

interface AppState {
    redirectPath: string;
    extensionVersion: string;
    deployData: { channelName: string, environmentName: string, packageEntries: IPackageRegistryEntry[], workspaceNames: string[], selectedPackage: IPackageRegistryEntry | undefined, committedDefinitions: string[], environmentPeers: string[], discoveredPeers: string[], orgMap: any, orgApprovals: any };
    tutorialData: Array<{ name: string, tutorials: ITutorialObject[], tutorialFolder: string, tutorialDescription?: string }>;
    repositoryData: {repositories: IRepositoryObject[]};
    activeTutorial: ITutorialObject;
    transactionViewData: {gatewayName: string, smartContract: ISmartContract, associatedTxdata: IAssociatedTxdata | undefined, txdataTransactions: IDataFileTransaction[], preselectedTransaction: ITransaction };
    transactionOutput: string;
}

class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            redirectPath: '',
            extensionVersion: '',
            tutorialData: [],
            repositoryData: {repositories: []},
            activeTutorial: { title: '', series: '', length: '', file: '', objectives: [] },
            deployData: { channelName: '', environmentName: '', packageEntries: [], workspaceNames: [], selectedPackage: undefined, committedDefinitions: [], environmentPeers: [], discoveredPeers: [], orgMap: {}, orgApprovals: {} },
            transactionViewData: {gatewayName: '', smartContract: {name: '', version: '', channel: '', label: '', transactions: [], namespace: '', peerNames: [] }, associatedTxdata: undefined, txdataTransactions: [], preselectedTransaction: { name: '', parameters: [], tag: [], returns: { type: '' } } },
            transactionOutput: ''
        };
    }

    componentDidMount(): void {
        window.addEventListener('message', (event: MessageEvent) => {

            const newState: any = {
                redirectPath: event.data.path
            };

            if (event.data.version) {
                newState.extensionVersion = event.data.version;
            }

            if (event.data.tutorialData && event.data.tutorialData.tutorials) {
                // tutorials should always be passed, activeTutorial is optional for single tutorial page
                newState.tutorialData = event.data.tutorialData.tutorials;

                if (event.data.tutorialData.activeTutorial) {
                    newState.activeTutorial = event.data.tutorialData.activeTutorial;
                }
            }

            if (event.data.repositoryData && event.data.repositoryData.repositories) {

                newState.repositoryData = event.data.repositoryData;
            }

            if (event.data.deployData) {
                newState.deployData = event.data.deployData;
            }

            if (event.data.transactionViewData) {
                newState.transactionViewData = event.data.transactionViewData;
            }

            if (event.data.transactionOutput) {
                newState.transactionOutput = event.data.transactionOutput;
            }

            this.setState(newState);
        });
    }

    render(): JSX.Element {
        if (this.state.redirectPath === '') {
            return <div></div>;
        }

        let appClass: string = '';
        if (this.state.redirectPath === '/tutorials' || this.state.redirectPath === '/samples') {
            appClass = 'app-container__gallery-page';
        }

        return (
            <Router>
                <div id='app-container'>
                    <div className={appClass}>
                        <Route render={(): JSX.Element => <Redirect push to={this.state.redirectPath} />}></Route>
                        <Route exact path='/home' render={(): JSX.Element =>
                            <HomePage extensionVersion={this.state.extensionVersion} />}>
                        </Route>
                        <Route exact path='/fabric2' render={(): JSX.Element =>
                            <Fabric2Page/>}>
                        </Route>
                        <Route exact path='/tutorials' render={(): JSX.Element =>
                            <TutorialGalleryPage tutorialData={this.state.tutorialData} />}>
                        </Route>
                        <Route exact path='/samples' render={(): JSX.Element =>
                            <SampleGalleryPage repositoryData={this.state.repositoryData} />}>
                        </Route>
                        <Route exact path='/viewTutorial' render={(): JSX.Element =>
                            <TutorialPage tutorialData={this.state.tutorialData} tutorial={this.state.activeTutorial} />}>
                        </Route>
                        <Route exact path='/deploy' render={(): JSX.Element =>
                            <DeployPage deployData={this.state.deployData} />}>
                        </Route>
                        <Route exact path='/transaction' render={(): JSX.Element =>
                            <TransactionPage transactionViewData={this.state.transactionViewData} transactionOutput={this.state.transactionOutput}/>}>
                        </Route>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
