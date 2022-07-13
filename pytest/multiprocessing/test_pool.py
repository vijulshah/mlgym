from multiprocessing import Queue
from typing import List

import pytest
from ml_gym.multiprocessing.job import Job
from ml_gym.multiprocessing.pool import Pool
from ml_gym.util.logger import QueuedLogging

from test_job import JobFixture, DeviceFixture, LoggingFixture


class TestPool(JobFixture, DeviceFixture, LoggingFixture):
    @pytest.fixture
    def num_processes(self) -> int:
        return 2

    @pytest.fixture
    def log_std_to_file(self) -> bool:
        return False

    @pytest.fixture
    def pool(self, num_processes, devices, start_logging) -> Pool:
        pool = Pool(num_processes=num_processes, devices=devices)
        return pool

    def test_add_job(self, pool: Pool, job: Job):
        assert pool.job_q.empty()
        pool.add_job(job)
        assert pool.job_count == pool.job_q.qsize() == 1
        # remove one by one
        pool.job_q.get()
        assert pool.job_q.empty()
        QueuedLogging.stop_listener()

    def test_add_jobs(self, pool: Pool, jobs: List[Job], num_processes):
        assert pool.job_q.empty()
        pool.add_jobs(jobs)
        assert not pool.job_q.empty() and pool.job_count == pool.job_q.qsize()
        # remove one by one
        for i in range(pool.job_count):
            pool.job_q.get()
        assert pool.job_q.empty()
        QueuedLogging.stop_listener()

    def test_run(self, pool: Pool, jobs: List[Job], num_processes: int):
        pool.add_jobs(jobs)
        assert len(pool.worker_processes) == 0
        assert pool.job_q.qsize() == 10
        pool.run()
        assert pool.job_q.qsize() == 0
        assert pool.done_q.qsize() == 0
        assert len(pool.worker_processes) == num_processes
        QueuedLogging.stop_listener()

    def test_create_or_replace_process(self, pool: Pool, num_processes:int):
        for process_id in range(num_processes):
            # add process
            pool.create_or_replace_process(process_id, num_jobs_to_perform=1)
            assert pool.worker_processes[process_id].process_id == process_id
            assert len(pool.worker_processes) == process_id+1

        assert len(pool.worker_processes) == num_processes

        for process_id in range(num_processes):
            # replace process
            pool.create_or_replace_process(process_id, num_jobs_to_perform=1)
            assert pool.worker_processes[process_id].process_id == process_id
            assert len(pool.worker_processes) == num_processes
        QueuedLogging.stop_listener()

