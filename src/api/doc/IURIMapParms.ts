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

export interface IURIMapParms {
    /**
     * The name of the URIMap
     * Up to eight characters long
     */
    name: string;

    /**
     * CSD group for the URIMap
     * Up to eight characters long
     */
    csdGroup: string;

    /**
     * Path component of URI to which the map applies
     * Up to 255 characters long
     */
    path?: string;

    /**
     * Host component of URI to which the map applies
     * Up to 116 characters long
     */
    host?: string;

    /**
     * Scheme component of URI to which the map applies
     * Allowed values: http, https
     */
    scheme?: string;

    /**
     * Application program that will process the request
     * Only used for server URIMaps; up to 8 characters long
     */
    programName?: string;

    /**
     * Pipeline that will process the request
     * Only used for pipeline URIMaps; up to 8 characters long
     */
    pipelineName?: string;

    /**
     * The name of the CICS region of the URIMap
     */
    regionName: string;

    /**
     * CICS Plex of the URIMap
     */
    cicsPlex?: string;
}