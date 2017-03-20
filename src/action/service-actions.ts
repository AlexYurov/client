import AbstractActions from "./abstract-actions"
import alt from "../alt"
import {defaultIcon} from "../util"

interface IServiceActions {
    updateServices(services: ServiceInfo[]): ServiceInfo[]
}

class ServiceActions extends AbstractActions implements IServiceActions {

    updateServices(services: ServiceInfo[]) {
        return services
    }
}

export let serviceActions = alt.createActions<IServiceActions>(ServiceActions)
export default serviceActions
