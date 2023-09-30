import subprocess

def deploy():
    # Construct the command as a single string
    command = 'ssh xn--dnerguide-07a.de@ssh.strato.de "cd /mnt/web310/b1/02/512442602/htdocs/doenerguide && git pull"'

    # Run the command using subprocess.run()
    process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, text=True)

    # Print the output
    print(process.stdout)

deploy()
