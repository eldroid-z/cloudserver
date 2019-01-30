const assert = require('assert');
const parseLC = require('../../../lib/data/locationConstraintParser');
const AwsClient = require('../../../lib/data/external/AwsClient');
const inMemory = require('../../../lib/data/in_memory/backend').backend;
const DataFileInterface = require('../../../lib/data/file/backend');

const memLocation = 'scality-internal-mem';
const fileLocation = 'scality-internal-file';
const awsLocation = 'awsbackend';
const awsHttpLocation = 'awsbackendhttp';
const clients = parseLC();

const { config } = require('../../../lib/Config');

describe('locationConstraintParser', () => {
    it('should return object containing mem object', () => {
        assert.notStrictEqual(clients[memLocation], undefined);
        assert.strictEqual(typeof clients[memLocation], 'object');
        assert.deepEqual(clients[memLocation], inMemory);
    });
    it('should return object containing file object', () => {
        assert.notStrictEqual(clients[fileLocation], undefined);
        assert(clients[fileLocation] instanceof DataFileInterface);
    });

    it('should set correct options for https(default) aws_s3 type loc', () => {
        const client = clients[awsLocation];
        const proto = config.outboundProxy && config.outboundProxy.url ?
            undefined : 'https';
	assert.notStrictEqual(client, undefined);
        assert(client instanceof AwsClient);
        assert.strictEqual(client._s3Params.sslEnabled, true);
	assert.strictEqual(client._s3Params.httpOptions.agent.protocol,
            proto);
        assert.strictEqual(client._s3Params.httpOptions.agent.keepAlive, false);
        assert.strictEqual(client._s3Params.signatureVersion, 'v4');
    });

    it('should set correct options for http aws_s3 type location', () => {
        const client = clients[awsHttpLocation];
        const proto = config.outboundProxy && config.outboundProxy.url ?
            undefined : 'http';
	assert.notStrictEqual(client, undefined);
        assert(client instanceof AwsClient);
        assert.strictEqual(client._s3Params.sslEnabled, false);
        assert.strictEqual(client._s3Params.httpOptions.agent.protocol,
            proto);
        assert.strictEqual(client._s3Params.httpOptions.agent.keepAlive, false);
        assert.strictEqual(client._s3Params.signatureVersion, 'v2');
    });
});
