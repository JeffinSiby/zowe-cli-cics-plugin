/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { AbstractSession, ImperativeExpect, Logger } from "@zowe/imperative";
import { CicsCmciRestClient } from "../../rest";
import { CicsCmciConstants } from "../../constants";
import { ICMCIApiResponse, IProgramParms, ITransactionParms, IURIMapParms } from "../../doc";

/**
 * Define a new program resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IProgramParms} parms - parameters for defining your program
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS program name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineProgram(session: AbstractSession, parms: IProgramParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Program name", "CICS program name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to define a program with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: {
                        name: parms.name,
                        csdgroup: parms.csdGroup
                    }
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + cicsPlex + parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

/**
 * Define a new transaction resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {ITransactionParms} parms - parameters for defining your transaction
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS transaction name not defined or blank
 * @throws {ImperativeError} CICS program name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineTransaction(session: AbstractSession, parms: ITransactionParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Transaction name", "CICS transaction name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.programName, "CICS Program name", "CICS program name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to define a transaction with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: {
                        name: parms.name,
                        program: parms.programName,
                        csdgroup: parms.csdGroup
                    }
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + cicsPlex +
        parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource,
        [], requestBody) as any;
}

/**
 * Define a new server URIMap to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IURIMapParms} parms - parameters for defining your URIMap
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS URIMap name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS URIMap path not defined or blank
 * @throws {ImperativeError} CICS URIMap host not defined or blank
 * @throws {ImperativeError} CICS URIMap program name not defined or blank
 * @throws {ImperativeError} CICS URIMap scheme not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineUrimapServer(session: AbstractSession, parms: IURIMapParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS URIMap name", "CICS URImap name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.path, "CICS URIMap Path", "CICS URIMap path is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.host, "CICS URIMap Host", "CICS URIMap host is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.programName, "CICS URIMap Program Name", "CICS URIMap program name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.scheme, "CICS URIMap Scheme", "CICS URIMap scheme is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to define a URIMap with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: {
                        name: parms.name,
                        csdgroup: parms.csdGroup,
                        path: parms.path,
                        host: parms.host,
                        program: parms.programName,
                        scheme: parms.scheme
                    }
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + cicsPlex + parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

// /**
//  * Define a new transaction resource to CICS through CMCI REST API
//  * @param {AbstractSession} session - the session to connect to CMCI with
//  * @param {ITransactionParms} parms - parameters for defining your transaction
//  * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
//  *                          when the request is complete
//  * @throws {ImperativeError} CICS transaction name not defined or blank
//  * @throws {ImperativeError} CICS program name not defined or blank
//  * @throws {ImperativeError} CICS CSD group not defined or blank
//  * @throws {ImperativeError} CICS region name not defined or blank
//  * @throws {ImperativeError} CicsCmciRestClient request fails
//  */
// export async function defineTransaction(session: AbstractSession, parms: ITransactionParms): Promise<ICMCIApiResponse> {
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Transaction name", "CICS transaction name is required");
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.programName, "CICS Program name", "CICS program name is required");
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

//     Logger.getAppLogger().debug("Attempting to define a transaction with the following parameters:\n%s", JSON.stringify(parms));
//     const requestBody: any = {
//         request: {
//             create: {
//                 parameter: {
//                     $: {
//                         name: "CSD",
//                     }
//                 },
//                 attributes: {
//                     $: {
//                         name: parms.name,
//                         program: parms.programName,
//                         csdgroup: parms.csdGroup
//                     }
//                 }
//             }
//         }
//     };

//     const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
//     const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
//         CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + cicsPlex +
//         parms.regionName;
//     return CicsCmciRestClient.postExpectParsedXml(session, cmciResource,
//         [], requestBody) as any;
// }

// /**
//  * Define a new transaction resource to CICS through CMCI REST API
//  * @param {AbstractSession} session - the session to connect to CMCI with
//  * @param {ITransactionParms} parms - parameters for defining your transaction
//  * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
//  *                          when the request is complete
//  * @throws {ImperativeError} CICS transaction name not defined or blank
//  * @throws {ImperativeError} CICS program name not defined or blank
//  * @throws {ImperativeError} CICS CSD group not defined or blank
//  * @throws {ImperativeError} CICS region name not defined or blank
//  * @throws {ImperativeError} CicsCmciRestClient request fails
//  */
// export async function defineTransaction(session: AbstractSession, parms: ITransactionParms): Promise<ICMCIApiResponse> {
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Transaction name", "CICS transaction name is required");
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.programName, "CICS Program name", "CICS program name is required");
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
//     ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

//     Logger.getAppLogger().debug("Attempting to define a transaction with the following parameters:\n%s", JSON.stringify(parms));
//     const requestBody: any = {
//         request: {
//             create: {
//                 parameter: {
//                     $: {
//                         name: "CSD",
//                     }
//                 },
//                 attributes: {
//                     $: {
//                         name: parms.name,
//                         program: parms.programName,
//                         csdgroup: parms.csdGroup
//                     }
//                 }
//             }
//         }
//     };

//     const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
//     const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
//         CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + cicsPlex +
//         parms.regionName;
//     return CicsCmciRestClient.postExpectParsedXml(session, cmciResource,
//         [], requestBody) as any;
// }
