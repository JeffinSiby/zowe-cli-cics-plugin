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

import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { generateRandomAlphaNumericString, runCliScript } from "../../../../__src__/TestUtils";
import { Session } from "@zowe/imperative";
import { IURIMapParms } from "../../../../../src";
import { deleteUrimap } from "../../../../../src/api/methods/delete/Delete";

let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let host: string;
let port: number;
let user: string;
let password: string;
let protocol: string;
let rejectUnauthorized: boolean;
let session: Session;

describe("CICS define urimap-pipeline command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "define_urimap_pipeline",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        const cmciProperties = TEST_ENVIRONMENT.systemTestProperties.cmci;
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cmci.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cmci.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cmci.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cmci.password;
        protocol = TEST_ENVIRONMENT.systemTestProperties.cmci.protocol;
        rejectUnauthorized = TEST_ENVIRONMENT.systemTestProperties.cmci.rejectUnauthorized;
        session = new Session({
            type: "basic",
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            user: cmciProperties.user,
            password: cmciProperties.password,
            strictSSL: false,
            protocol: "http",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to successfully define a pipeline urimap with basic options", async () => {
        const urimapNameSuffixLength = 4;
        const urimapName = "DFN" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const options: IURIMapParms = { name: urimapName, csdGroup, regionName };
        let output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, "urimap/test/invalid.html", "www.example.com", "FAKEPIPE", regionName]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/get_resource_urimap.sh", TEST_ENVIRONMENT,
            [regionName,
                csdGroup]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain(urimapName);
        expect(output.stdout.toString()).toContain("ENABLED");

        await deleteUrimap(session, options);
    });

    it("should be able to successfully define a pipeline urimap with all options", async () => {
        const urimapNameSuffixLength = 4;
        const urimapName = "DFN" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const description = "hi i am urimap";
        const transactionName = "tTxn";
        const webserviceName = "testWebService";
        const options: IURIMapParms = { name: urimapName, csdGroup, regionName };
        let output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline_all_options.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, "urimap/test/invalid.html", "www.example.com", "FAKEPIPE", regionName,
            description, transactionName, webserviceName]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/get_resource_urimap.sh", TEST_ENVIRONMENT,
            [regionName,
                csdGroup]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain(urimapName);
        expect(output.stdout.toString()).toContain("ENABLED");
        expect(output.stdout.toString()).toContain(description);
        expect(output.stdout.toString()).toContain(transactionName);
        expect(output.stdout.toString()).toContain(webserviceName);

        await deleteUrimap(session, options);
    });

    it("should get a syntax error if urimap name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            ["", "FAKEGRP", "FAKEPATH", "FAKEHOST", "FAKEPIPE", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap");
        expect(stderr).toContain("name");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if CSD group is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "", "FAKEPATH", "FAKEHOST", "FAKEPIPE", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("csdGroup");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if urimap path is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "", "FAKEHOST", "FAKEPIPE", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap-path");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if urimap host is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "", "FAKEPIPE", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap-host");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if pipeline name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "FAKEHOST", "", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("pipeline-name");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if region name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "FAKEHOST", "FAKEPIPE", ""]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("region-name");
        expect(output.status).toEqual(1);
    });

    it("should be able to successfully define a pipeline urimap using profile options", async () => {
        const urimapNameSuffixLength = 4;
        const urimapName = "DFN" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapHost = "www.example.com";
        const urimapScheme = "http";
        const urimapPath = "urimap/test/invalid.html";
        const pipelineName = "FAKEPIPE";
        const options: IURIMapParms = { name: urimapName, csdGroup, regionName };
        let output = runCliScript(__dirname + "/__scripts__/define_urimap_pipeline_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
                urimapPath,
                urimapHost,
                urimapScheme,
                pipelineName,
                regionName,
                host,
                port,
                user,
                password,
                protocol,
                rejectUnauthorized]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/get_resource_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
            [regionName,
                csdGroup,
                host,
                port,
                user,
                password,
                protocol,
                rejectUnauthorized]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain(urimapName);
        expect(output.stdout.toString()).toContain("ENABLED");

        await deleteUrimap(session, options);
    });

});
