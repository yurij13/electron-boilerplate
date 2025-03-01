import osUtils from "os-utils";
import fs from "fs";

const POLLING_INTERVAL = 1000;

export function pollResources() {


}

function getCPUUsage() {
    return new Promise((resolve, reject) => {
        osUtils.cpuUsage((percentage) => resolve(percentage))
    })
}

function getMemoryUsage() {
    return 1 - osUtils.freememPercentage();
}

function getStorageData() {

}