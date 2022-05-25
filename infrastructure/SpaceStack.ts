import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Code, Function as LambdaFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from 'path';
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {GenericTable} from "./GenericTable";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'SpaceTpApi')
    private spacesTpTable = new GenericTable(
        'SpacesTpTable',
        'spaceId',
        this
    )

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        const helloTpLambda = new LambdaFunction(this, 'helloTpLambda', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        })
        const helloLambdaTpNodeJs = new NodejsFunction(this, 'helloLambdaTpNodeJs', {
            entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler'
        })
        // hello lambda integration:
        const helloLambdaTpIntegration = new LambdaIntegration(helloTpLambda)
        const helloLambdaTpResource = this.api.root.addResource('hello')
        helloLambdaTpResource.addMethod('GET', helloLambdaTpIntegration)
    }

}