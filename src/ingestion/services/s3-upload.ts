require("dotenv").config();
import {lookup} from "mime-types";
import {Client} from "minio"

const minioClient = new Client({
    endPoint: process.env.END_POINT,
    port: +process.env.S3_PORT,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

minioClient.listBuckets(function (e, buckets) {
    if (e) return console.log(e);
    console.log('buckets :', buckets)
});

export function uploadToS3(bucketName, file, fileName, folderName) {
    let metaData = {
        "Content-Type": lookup(fileName),
    };

    return new Promise((resolve,reject)=>{
        minioClient.fPutObject(
            bucketName,
            `${folderName}/${fileName}`,
            file,
            metaData,
            function (err, objInfo) {
                if (err) {
                    reject(err);
                }
                console.log("Success", objInfo);
                resolve(objInfo);
            }
        );
    })

}
