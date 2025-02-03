// Create Project Alpha
CREATE (p1:Project {
  id: randomUUID(),
  name: 'Project Alpha',
  description: 'Developing a new software product',
  type: 'SOFTWARE',
  category: 'Technology',
  status: 'PLANNED',
  startDate: date('2024-03-15'),
  endDate: date('2025-03-15'),
  createdAt: datetime(),
  updatedAt: datetime()
});

// Create Project Beta
CREATE (p2:Project {
  id: randomUUID(),
  name: 'Project Beta',
  description: 'Building a new robot',
  type: 'HARDWARE',
  category: 'Robotics',
  status: 'IN_PROGRESS',
  startDate: date('2023-10-01'),
  endDate: date('2024-05-15'),
  createdAt: datetime(),
  updatedAt: datetime()
});

// Create Milestones for Project Alpha
CREATE (m1:Milestone {
  id: randomUUID(),
  name: 'Requirement Gathering',
  description: 'Gather and document project requirements',
  dueDate: date('2024-04-15'),
  status: 'PENDING',
  createdAt: datetime(),
  updatedAt: datetime()
});
CREATE (m2:Milestone {
  id: randomUUID(),
  name: 'Design Phase',
  description: 'Design the software architecture',
  dueDate: date('2024-06-15'),
  status: 'PENDING',
  createdAt: datetime(),
  updatedAt: datetime()
});
CREATE (m3:Milestone {
  id: randomUUID(),
  name: 'Development',
  description: 'Start writing code',
  dueDate: date('2024-12-15'),
  status: 'PENDING',
  createdAt: datetime(),
  updatedAt: datetime()
});

// Create Milestones for Project Beta
CREATE (m4:Milestone {
  id: randomUUID(),
  name: 'Prototype Construction',
  description: 'Build the first working robot prototype',
  dueDate: date('2024-01-01'),
  status: 'COMPLETED',
  createdAt: datetime(),
  updatedAt: datetime()
});
CREATE (m5:Milestone {
  id: randomUUID(),
  name: 'Testing',
  description: 'Testing the robot functionality',
  dueDate: date('2024-03-01'),
  status: 'IN_PROGRESS',
  createdAt: datetime(),
  updatedAt: datetime()
});

// Relate Milestones to Project Alpha
MATCH (p:Project {name: 'Project Alpha'})
MATCH (m) WHERE m.name IN ['Requirement Gathering', 'Design Phase', 'Development']
CREATE (p)-[:HAS_MILESTONE]->(m);

// Relate Milestones to Project Beta
MATCH (p:Project {name: 'Project Beta'})
MATCH (m) WHERE m.name IN ['Prototype Construction', 'Testing']
CREATE (p)-[:HAS_MILESTONE]->(m);