# Backend

## How to setup local environment for the server

### Initial setup (do this once)

1. install python
2. Create python environment

Make sure your inside the `backend/` folder before you run:

```bash
python -m venv venv
```

#### Install required packages

make sure your inside the `backend/` folder before you run:

Windows

```bash
.\venv\Scripts\activate
pip install -r requirements.txt
```

Linux

```bash
./venv/bin/activate
pip install -r requirements.txt
```

### Do this everytime before you start working

1. make sure your inside the `backend/` folder before you run:

Windows

```bash
.\venv\Scripts\activate
```

Linux

```bash
./venv/bin/activate
```

### Starting the server

```bash
fastapi dev server.py # server.py is the python file
```
