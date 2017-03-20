import alt from "../alt"
import AbstractStoreModel from "./abstract-store"
import serviceActions from "../action/service-actions"

interface ServiceState {
    services: ServiceInfo[]
}

class ServiceStore extends AbstractStoreModel<ServiceState> {

    services: ServiceInfo[]

    constructor() {
        super()
        this.bindListeners({
            handleUpdateServices: serviceActions.updateServices
        })
    }

    handleUpdateServices(services: ServiceInfo[]) {
        this.services = services
    }
}

export let serviceStore = alt.createStore<ServiceState>(ServiceStore, "ServiceStore")
export default serviceStore
