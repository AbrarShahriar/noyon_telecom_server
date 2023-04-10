const { exec } = require("child_process")
const { promisify } = require("util")

const execAsync = promisify(exec)

const name = process.env.npm_config_name

const sequentialExecution = async (...commands) => {
    if (commands.length === 0) {
        return 0
    }

    const { stdout, stderr } = await execAsync(commands.shift())

    if (stderr) {
        throw stderr
    }

    console.log(stdout);

    return sequentialExecution(...commands)
}

sequentialExecution(
    `nest g mo ${name}`,
    `nest g co ${name} --no-spec`,
    `nest g s ${name} --no-spec`,
    // `cd src/collection/`,
    // `mkdir entity`,
    // `cd entity`,
    // `type nul > collection.entity.ts`,
    // `cd ..`,
    // `mkdir dto`,
    // `cd dto`,
    // `type nul > collection.dto.ts`,
)

// USAGE: npm run nest:generate --name="name"

// exec(`nest g mo ${name} && nest g co ${name} --no-spec && nest g s ${name} --no-spec`)