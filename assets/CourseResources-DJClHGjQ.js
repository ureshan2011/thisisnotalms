import{r as a,M as e,aC as V,af as Ie,aq as te,ar as Y,ac as Pe,aD as K,ap as Le,aw as ct,an as _e,as as Be,aK as Se,ax as G,ad as he,bx as ie,aa as ae,by as oe,bz as re,bA as le,aB as X,bB as rt,bC as Ft,aP as ce,bi as Wt,ao as pt,bD as Et,bE as Ut,aN as lt,b4 as Dt,aH as xt,be as Yt,bF as qt,bG as mt,bH as At,bI as Ce,ab as Oe,aO as _t,aQ as ge,aU as Ht,am as Kt,bJ as Gt,b7 as Qt,bK as Ue,bL as Zt,bM as Vt,bN as Ge,bO as Qe,bP as Jt,bQ as $t,bR as Xt,bS as es}from"./vendor-react-f-umZFkH.js";import{b as ts,c as ze,s as se,q as ft,o as gt,a as ht,i as Re,d as $,f as Te,u as He,j as jt,g as Mt}from"./vendor-firebase-vPFcgpyw.js";import{L as Ze}from"./Layout-BqLyHOJ2.js";import{u as me,L as ss}from"./index-DDRO9ycQ.js";import{d as U}from"./firebase-5IQ8Sn6H.js";import"./PhotoUploadModal-CqTa6g93.js";import"./vendor-three-BVWryWyU.js";const is="mbi802-dbms-basics-v1",Ct="Database Management System Fundamentals",as=60,xe=[{id:"q01",category:"Data vs Information",question:'Which of the following best describes "data"?',choices:["Processed facts that are meaningful and useful to decision-makers","Raw, unprocessed facts and figures that have no inherent meaning on their own","A structured collection of related tables stored in a computer","Instructions provided to a computer to perform a task"],correct:1},{id:"q02",category:"Data vs Information",question:`A student's exam score "85" stored in isolation — with no student name, subject, or date — is best classified as:`,choices:["Information, because it refers to an academic grade","Data, because it is a raw number with no context","A record, because it belongs to a student profile","Metadata, because it describes a student's performance"],correct:1},{id:"q03",category:"Data vs Information",question:"Which of the following is an example of information (not just data)?",choices:["42",'"Auckland"','"John Smith achieved a distinction grade in MBI802 during Semester 1, 2025"',"TRUE"],correct:2},{id:"q04",category:"Data vs Information",question:"What is the primary requirement for converting data into information?",choices:["Storing it in a relational database","Encrypting it to ensure security","Providing context and processing to give it meaning","Duplicating it across multiple servers for availability"],correct:2},{id:"q05",category:"Data vs Information",question:"Which of the following is NOT a characteristic of high-quality information?",choices:["Accuracy — the information reflects reality","Timeliness — the information is current and up-to-date","Being in raw, unprocessed form without any context","Relevance — the information is useful for the decision at hand"],correct:2},{id:"q06",category:"Data vs Information",question:"A retail company exports a file containing thousands of transaction amounts from its point-of-sale system — just numbers, no product names, no dates. This file is best described as:",choices:["Information, because it comes from a business system","A report, because it was exported from software","Data, because the numbers lack meaningful context on their own","A database, because it contains many values"],correct:2},{id:"q07",category:"Data vs Information",question:"Which statement correctly describes the relationship between data and information?",choices:["Information and data are interchangeable terms meaning the same thing","Data is always more valuable than information","Data is the raw input; information is the meaningful output after processing","Information is collected first, and data is produced from it"],correct:2},{id:"q08",category:"Relational Database Basics",question:"What is the purpose of a primary key in a relational database table?",choices:["To link two tables together using a foreign reference","To uniquely identify each row/record in the table","To sort the rows in ascending order automatically","To encrypt sensitive data stored in the table"],correct:1},{id:"q09",category:"Relational Database Basics",question:"A foreign key in one table refers to:",choices:["Any column that contains text (string) values","The primary key of the same table it belongs to","The primary key (or unique key) of another table, establishing a link","A key that is not used for searching or indexing"],correct:2},{id:"q10",category:"Relational Database Basics",question:'In relational database terminology, a "table" is formally known as a:',choices:["Schema","Relation","Tuple","Domain"],correct:1},{id:"q11",category:"Relational Database Basics",question:"RDBMS stands for:",choices:["Real-time Database and Management System","Relational Data and Backup Management System","Relational Database Management System","Remote Database Monitoring System"],correct:2},{id:"q12",category:"Relational Database Basics",question:"Which SQL statement is used to retrieve data from a database?",choices:["INSERT","UPDATE","DELETE","SELECT"],correct:3},{id:"q13",category:"Relational Database Basics",question:"In a database, a NULL value means:",choices:["The value is zero (0)",'The value is an empty string ("")',"The field has no value or the value is unknown/missing","The column has been deleted from the table"],correct:2},{id:"q14",category:"Relational Database Basics",question:"First Normal Form (1NF) requires that:",choices:["Every non-key attribute depends on the whole primary key","Every non-key attribute depends only on the primary key, not on other non-key attributes","Each column holds atomic (indivisible) values, and each row is unique","The table has at least one foreign key referencing another table"],correct:2},{id:"q15",category:"Relational Database Basics",question:"A composite key is:",choices:["A primary key that is also a foreign key in another table","A primary key formed by combining two or more columns to uniquely identify a row","A key that allows duplicate values within the same column","An index created automatically on every column in the table"],correct:1},{id:"q16",category:"Relational Database Basics",question:"Referential integrity in a relational database ensures that:",choices:["All data is stored in sorted order for fast retrieval","No two rows can have the same primary key value","A foreign key value must either match an existing primary key value or be NULL","All column names across all tables must be unique"],correct:2},{id:"q17",category:"Relational Database Basics",question:"Which type of JOIN returns ALL records from both tables, matching where possible and filling NULLs where there is no match?",choices:["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"],correct:3},{id:"q18",category:"Relational Database Basics",question:"An Entity-Relationship (ER) diagram is used to:",choices:["Write SQL queries in a visual format","Plan and represent the logical structure of a database before implementation","Monitor database performance in real time","Back up and restore database records"],correct:1},{id:"q19",category:"Relational Database Basics",question:"In database design, a many-to-many relationship between two entities is typically implemented by:",choices:["Adding extra columns to one of the two tables","Merging both tables into a single table","Creating a junction (bridge) table that holds foreign keys from both tables","Using NULL values to represent the missing side of the relationship"],correct:2},{id:"q20",category:"Relational Database Basics",question:'Which of the following SQL data types is most appropriate for storing a phone number like "021-012-3456"?',choices:["INT, because phone numbers are numeric","FLOAT, because phone numbers can contain decimal points","VARCHAR, because phone numbers can have leading zeros, dashes, and spaces","BOOLEAN, because a phone number is either valid or invalid"],correct:2},{id:"q21",category:"Real-World Scenarios",question:"A hospital wants to manage patient records, doctor details, appointment schedules, and medical history. Is this a suitable scenario for a relational database?",choices:["No, because medical data is too sensitive to be stored digitally","No, because the data is too complex for any database","Yes, because a relational database can handle related entities like patients, doctors, and appointments with enforced integrity","Yes, but only if the hospital has more than 10,000 patients"],correct:2},{id:"q22",category:"Real-World Scenarios",question:'A student stores all classmate information in a single database cell as: "John,25,MBI802,Auckland | Sarah,22,MBI800,Christchurch". What is the main problem with this approach?',choices:["The cell will run out of storage space immediately","It violates atomicity — multiple values in one cell break First Normal Form (1NF)","MySQL does not support text fields larger than 50 characters","There is no problem; this is a valid and efficient storage technique"],correct:1},{id:"q23",category:"Real-World Scenarios",question:"A library system records which member has borrowed which book. Each book can be borrowed by only one member at a time, but one member can borrow many books. What is the relationship between Members and Books?",choices:["Many-to-Many, because many books exist for many members","One-to-One, because each book belongs to exactly one library","One-to-Many, because one member can borrow many books, but each book is borrowed by only one member at a time","No relationship; they should be stored in separate, unlinked databases"],correct:2},{id:"q24",category:"Real-World Scenarios",question:"In a university system, students can enrol in many courses, and each course can have many students. What type of relationship exists between Students and Courses?",choices:["One-to-One","One-to-Many","Many-to-One","Many-to-Many"],correct:3},{id:"q25",category:"Real-World Scenarios",question:"A business discovers that the same customer appears multiple times in their Customers table with slightly different spellings of their name. What type of database problem is this?",choices:["A normalisation error — the table is not in 3NF","A data redundancy and integrity problem — duplicate records compromise data quality","A referential integrity violation — foreign keys are broken","A performance issue — indexes are not set up correctly"],correct:1},{id:"q26",category:"Real-World Scenarios",question:"A school wants to track which teachers teach which subjects, where one teacher can teach multiple subjects and one subject can be taught by multiple teachers. Can a relational database handle this?",choices:["No, because teachers and subjects are too similar to store separately","Yes, using a Many-to-Many relationship with a junction table (e.g., TeacherSubject)","Yes, but only by merging teachers and subjects into one table","No, because school data does not fit the relational model"],correct:1},{id:"q27",category:"Real-World Scenarios",question:"You need to keep a quick grocery list of 5 items for a single trip to the supermarket. Should you build a relational database for this?",choices:["Yes, always use a database for any data storage need","Yes, because databases are the most efficient storage option for all sizes","No, a simple note or text file is more appropriate — a full database is overkill for 5 items","No, because grocery items cannot be modelled in a relational schema"],correct:2},{id:"q28",category:"Real-World Scenarios",question:"A social media platform needs to store users who can follow each other (User A follows User B, User B also follows User A). What relationship type does this represent?",choices:["One-to-One relationship between two user tables","A self-referencing Many-to-Many relationship within the same Users table","A One-to-Many relationship where one user leads all others","A recursive One-to-One relationship"],correct:1},{id:"q29",category:"Real-World Scenarios",question:"An e-commerce company's database has a Customers table and an Orders table. When a customer record is deleted and referential integrity (with ON DELETE RESTRICT) is enforced, what happens to their linked orders?",choices:["The orders are automatically reassigned to a default customer","Nothing; the orders remain with a NULL customer reference","The deletion is blocked — the customer cannot be deleted while orders exist","The database automatically creates a backup of the deleted customer"],correct:2},{id:"q30",category:"Real-World Scenarios",question:"A developer creates a Products table with columns: ProductID, ProductName, Category, CategoryDescription, SupplierName, SupplierPhone. What database design problem does this table have?",choices:["The table has too many columns — MySQL only allows 5 columns per table","Category and Supplier details should be in separate tables; storing them here creates data redundancy and update anomalies","ProductID should not be a primary key because product IDs can change","The table is missing a foreign key to make it relational"],correct:1},{id:"q31",category:"Real-World Scenarios",question:"A weather station records temperature readings every minute, 24/7, across 100 sensors. Over a year this generates tens of millions of rows. Is a relational database appropriate?",choices:["No, relational databases cannot handle more than 10,000 rows","Yes, but only if the data is kept in a single table with no indexes","Yes, relational databases with proper indexing can handle very large datasets, though specialised time-series databases may be even more efficient for this use case","No, weather data must always be stored in spreadsheets for accuracy"],correct:2},{id:"q32",category:"Real-World Scenarios",question:"A company stores employee salary history. Each employee can have many salary records over time. The HR system needs to display the CURRENT salary quickly for thousands of employees. What design strategy would improve read performance?",choices:["Store all salary history in a single comma-separated cell",'Add an indexed "isCurrent" boolean column or maintain a separate CurrentSalary table for fast lookups',"Delete historical salary records after each pay rise","Store salaries in a separate database on a different server"],correct:1},{id:"q33",category:"Tricky Questions",question:"Technically, can a table in MySQL exist without a primary key?",choices:["No — MySQL enforces a primary key on every table by default","Yes — MySQL allows tables without a primary key, but it is considered very poor practice as it makes data management much harder","Yes — and it is recommended for large tables to improve insert performance","No — without a primary key, MySQL will refuse to create the table"],correct:1},{id:"q34",category:"Tricky Questions",question:"Can a NULL value be assigned to a primary key column?",choices:['Yes, NULL is a valid primary key value meaning "unknown ID"',"Yes, but only for the first record inserted into the table","No, primary key columns must always hold a non-NULL value to uniquely identify each row","Yes, if the table has a composite primary key"],correct:2},{id:"q35",category:"Tricky Questions",question:"What is denormalisation in database design?",choices:["The process of breaking a table into smaller tables to reduce redundancy","Intentionally introducing redundancy into a database to improve read performance at the cost of storage and update complexity","Removing all foreign keys from a database to simplify queries","Converting a database from relational to NoSQL format"],correct:1},{id:"q36",category:"Tricky Questions",question:'A database has three tables but no foreign keys linking them. Can it still be called a "relational database"?',choices:["Yes, any database with multiple tables is automatically relational","Yes, as long as it uses SQL it qualifies as a relational database","Technically the software (e.g., MySQL) is an RDBMS, but without enforced relationships the design does not follow relational principles — it behaves like separate flat files","No, MySQL requires at least one foreign key to operate correctly"],correct:2},{id:"q37",category:"Tricky Questions",question:"Searching for a value in an indexed column vs. a non-indexed column in a large table — which is generally faster?",choices:["Non-indexed search, because indexing adds overhead that slows queries","They are always the same speed regardless of indexing","Indexed search, because the index allows the database to jump directly to matching rows instead of scanning the entire table","It depends on whether the query uses SELECT or INSERT"],correct:2},{id:"q38",category:"Tricky Questions",question:"Is Microsoft Excel a database management system?",choices:["Yes, Excel is fully equivalent to MySQL and can replace it in all business applications","Excel can store and query data like a flat-file database, but it lacks RDBMS features such as enforced relationships, multi-user concurrency control, and ACID transactions","No, Excel cannot store any structured data and is purely a calculation tool","Yes, because Excel supports pivot tables, which are a form of database relationship"],correct:1}],Ne=[...new Set(xe.map(t=>t.category))],yt=["A","B","C","D"];function os({studentProfile:t}){const{user:r}=me(),[o,h]=a.useState("intro"),[s,w]=a.useState({}),[A,N]=a.useState(!1),[z,M]=a.useState(0),[S,D]=a.useState(!1),[f,g]=a.useState(Object.fromEntries(Ne.map(k=>[k,!0]))),d=Object.keys(s).length,l=xe.length,c=Math.round(d/l*100);function b(k,n){w(i=>({...i,[k]:n}))}function v(k){g(n=>({...n,[k]:!n[k]}))}async function E(){N(!0);const k=xe.filter(n=>s[n.id]===n.correct).length;M(k);try{await ts(ze(U,"mbi802QuizResults"),{quizId:is,studentUid:r?.uid??"",studentName:t?.fullName??r?.email??"Unknown",studentDisplayId:t?.studentId??"",studentSection:t?.section??"",studentCampus:t?.campus??"",score:k,total:l,percentage:Math.round(k/l*100),completedAt:se()})}catch{}h("result"),N(!1),window.scrollTo({top:0,behavior:"smooth"})}function R(){w({}),M(0),D(!1),g(Object.fromEntries(Ne.map(k=>[k,!0]))),h("intro"),window.scrollTo({top:0,behavior:"smooth"})}if(o==="intro")return e.jsx("div",{className:"space-y-4",children:e.jsx("div",{className:"rounded-2xl p-5 border",style:{background:"linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))",borderColor:"rgba(139,92,246,0.25)"},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(V,{size:22,style:{color:"#7c3aed",flexShrink:0,marginTop:2}}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#4c1d95"},children:Ct}),e.jsxs("p",{className:"text-xs mt-1 leading-5",style:{color:"#5b21b6"},children:[l," multiple-choice questions across four topic areas. No time limit — take your time and think carefully. You may retake as many times as you like."]}),e.jsx("div",{className:"flex flex-wrap gap-2 mt-3",children:Ne.map(k=>e.jsx("span",{className:"text-xs px-2.5 py-0.5 rounded-full font-medium",style:{background:"rgba(167,139,250,0.2)",color:"#6d28d9"},children:k},k))}),e.jsx("button",{onClick:()=>h("taking"),className:"btn-primary mt-4 text-sm px-5 py-2",children:"Start Quiz"})]})]})})});if(o==="result"){const k=Math.round(z/l*100),n=k>=as;return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"rounded-2xl p-6 border text-center",style:{background:n?"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))":"linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))",borderColor:n?"rgba(16,185,129,0.25)":"rgba(239,68,68,0.25)"},children:[e.jsx(Ie,{size:36,style:{color:n?"#059669":"#dc2626",margin:"0 auto 8px"}}),e.jsxs("p",{className:"text-3xl font-extrabold",style:{color:n?"#065f46":"#991b1b"},children:[z," / ",l]}),e.jsxs("p",{className:"text-lg font-semibold mt-1",style:{color:n?"#047857":"#b91c1c"},children:[k,"% — ",n?"Great work!":"Keep studying!"]}),e.jsx("div",{className:"mt-4 grid grid-cols-2 gap-2 text-left",children:Ne.map(i=>{const u=xe.filter(y=>y.category===i),C=u.filter(y=>s[y.id]===y.correct).length,p=Math.round(C/u.length*100);return e.jsxs("div",{className:"rounded-xl px-3 py-2",style:{background:"rgba(255,255,255,0.55)"},children:[e.jsx("p",{className:"text-xs font-semibold",style:{color:"#374151"},children:i}),e.jsxs("p",{className:"text-sm font-bold mt-0.5",style:{color:"#1e1b4b"},children:[C,"/",u.length," ",e.jsxs("span",{className:"text-xs font-normal",style:{color:"#6b7280"},children:["(",p,"%)"]})]})]},i)})})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap",children:[e.jsxs("button",{onClick:()=>D(i=>!i),className:"btn-secondary text-sm px-4 py-2 flex items-center gap-1.5",children:[S?e.jsx(te,{size:16}):e.jsx(Y,{size:16}),S?"Hide Review":"Review Answers"]}),e.jsxs("button",{onClick:R,className:"btn-secondary text-sm px-4 py-2 flex items-center gap-1.5",children:[e.jsx(Pe,{size:16})," Retake Quiz"]})]}),S&&e.jsx("div",{className:"space-y-4",children:xe.map((i,u)=>{const C=s[i.id]??-1,p=C===i.correct;return e.jsx("div",{className:"rounded-2xl p-4 border",style:{background:p?"rgba(209,250,229,0.5)":"rgba(254,226,226,0.5)",borderColor:p?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"},children:e.jsxs("div",{className:"flex items-start gap-2",children:[p?e.jsx(K,{size:18,style:{color:"#059669",flexShrink:0,marginTop:2}}):e.jsx(Le,{size:18,style:{color:"#dc2626",flexShrink:0,marginTop:2}}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wide mb-1",style:{color:"#6b7280"},children:["Q",u+1," · ",i.category]}),e.jsx("p",{className:"text-sm font-medium",style:{color:"#1e1b4b"},children:i.question}),e.jsx("div",{className:"mt-2 space-y-1",children:i.choices.map((y,x)=>{const j=x===C,I=x===i.correct;let T="transparent",P="#4b5563";return I?(T="rgba(209,250,229,0.8)",P="#065f46"):j&&!p&&(T="rgba(254,202,202,0.8)",P="#991b1b"),e.jsxs("div",{className:"text-xs px-3 py-1.5 rounded-lg flex items-center gap-2",style:{background:T,color:P},children:[e.jsxs("span",{className:"font-bold",children:[yt[x],"."]})," ",y,I&&e.jsx(K,{size:13,style:{marginLeft:"auto",color:"#059669"}})]},x)})})]})]})},i.id)})})]})}const m=l-d;return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"rounded-2xl p-4 border sticky top-0 z-10",style:{background:"rgba(245,243,255,0.97)",borderColor:"rgba(139,92,246,0.2)",backdropFilter:"blur(8px)"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#5b21b6"},children:[d," of ",l," answered"]}),e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#5b21b6"},children:[c,"%"]})]}),e.jsx("div",{className:"w-full rounded-full h-2",style:{background:"rgba(167,139,250,0.25)"},children:e.jsx("div",{className:"h-2 rounded-full transition-all",style:{width:`${c}%`,background:"linear-gradient(90deg, #8b5cf6, #6d28d9)"}})})]}),Ne.map(k=>{const n=xe.filter(C=>C.category===k),i=n.filter(C=>s[C.id]!==void 0).length,u=f[k];return e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(139,92,246,0.18)"},children:[e.jsxs("button",{onClick:()=>v(k),className:"w-full flex items-center justify-between px-4 py-3",style:{background:"linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.8))"},children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm font-bold",style:{color:"#4c1d95"},children:k}),e.jsxs("span",{className:"text-xs px-2 py-0.5 rounded-full font-medium",style:{background:i===n.length?"rgba(209,250,229,0.8)":"rgba(167,139,250,0.2)",color:i===n.length?"#065f46":"#6d28d9"},children:[i,"/",n.length]})]}),u?e.jsx(te,{size:16,style:{color:"#7c3aed"}}):e.jsx(Y,{size:16,style:{color:"#7c3aed"}})]}),u&&e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(139,92,246,0.1)"},children:n.map((C,p)=>{const y=xe.indexOf(C),x=s[C.id]??-1;return e.jsxs("div",{className:"p-4",style:{background:"rgba(255,255,255,0.6)"},children:[e.jsxs("p",{className:"text-xs font-semibold mb-2",style:{color:"#9ca3af"},children:["Question ",y+1,(p+1!==y+1,"")]}),e.jsx("p",{className:"text-sm font-medium leading-6",style:{color:"#1e1b4b"},children:C.question}),e.jsx("div",{className:"mt-3 space-y-2",children:C.choices.map((j,I)=>{const T=I===x;return e.jsxs("button",{onClick:()=>b(C.id,I),className:"w-full text-left text-sm rounded-xl px-3 py-2.5 border transition-all flex items-start gap-2",style:{borderColor:T?"#7c3aed":"rgba(139,92,246,0.18)",background:T?"linear-gradient(135deg, rgba(237,233,254,0.95), rgba(221,214,254,0.8))":"rgba(255,255,255,0.5)",color:T?"#4c1d95":"#374151",fontWeight:T?600:400},children:[e.jsx("span",{className:"flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5",style:{background:T?"#7c3aed":"rgba(139,92,246,0.12)",color:T?"#fff":"#7c3aed"},children:yt[I]}),e.jsx("span",{className:"leading-5",children:j})]},I)})})]},C.id)})})]},k)}),e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))",borderColor:"rgba(139,92,246,0.2)"},children:[m>0&&e.jsxs("p",{className:"text-xs mb-3",style:{color:"#92400e",background:"rgba(254,243,199,0.8)",borderRadius:8,padding:"6px 10px"},children:["You have ",m," unanswered question",m>1?"s":"",". You can still submit, but unanswered questions will count as incorrect."]}),e.jsx("button",{onClick:E,disabled:A,className:"btn-primary w-full flex items-center justify-center gap-2 py-3",children:A?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 rounded-full border-2 animate-spin",style:{borderColor:"#fff3",borderTopColor:"#fff"}}),"Submitting…"]}):e.jsxs(e.Fragment,{children:[e.jsx(ct,{size:16})," Submit Quiz"]})})]})]})}function bt(t){return t.toLocaleString("en-NZ",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function rs(){const[t,r]=a.useState([]),[o,h]=a.useState(!0),[s,w]=a.useState("date"),[A,N]=a.useState("desc"),[z,M]=a.useState(null),[S,D]=a.useState("");a.useEffect(()=>{const p=ft(ze(U,"mbi802QuizResults"),gt("completedAt","desc")),y=ht(p,x=>{const j=x.docs.map(I=>({id:I.id,studentUid:I.data().studentUid??"",studentName:I.data().studentName??"Unknown",studentDisplayId:I.data().studentDisplayId??"",studentSection:I.data().studentSection??"",studentCampus:I.data().studentCampus??"",score:I.data().score??0,total:I.data().total??0,percentage:I.data().percentage??0,completedAt:I.data().completedAt?.toDate()??new Date}));r(j),h(!1)});return()=>y()},[]);const f=t.reduce((p,y)=>((p[y.studentUid]=p[y.studentUid]??[]).push(y),p),{}),g=Object.values(f),d=g.map(p=>p.reduce((y,x)=>x.percentage>y.percentage?x:y)),l=t.length,c=g.length,b=d.length>0?Math.round(d.reduce((p,y)=>p+y.percentage,0)/d.length):0,v=d.filter(p=>p.percentage>=60).length,E=[{label:"0–39%",min:0,max:39,color:"#fca5a5"},{label:"40–59%",min:40,max:59,color:"#fcd34d"},{label:"60–79%",min:60,max:79,color:"#6ee7b7"},{label:"80–100%",min:80,max:100,color:"#818cf8"}],R=E.map(p=>d.filter(y=>y.percentage>=p.min&&y.percentage<=p.max).length),m=Math.max(...R,1),k=t.filter(p=>{const y=S.toLowerCase();return!y||p.studentName.toLowerCase().includes(y)||p.studentDisplayId.toLowerCase().includes(y)||p.studentSection.toLowerCase().includes(y)||p.studentCampus.toLowerCase().includes(y)});function n(p){return[...p].sort((y,x)=>{let j=0;return s==="name"?j=y.studentName.localeCompare(x.studentName):s==="score"?j=y.percentage-x.percentage:j=y.completedAt.getTime()-x.completedAt.getTime(),A==="asc"?j:-j})}function i(p){s===p?N(y=>y==="asc"?"desc":"asc"):(w(p),N("desc"))}function u({k:p}){return s!==p?e.jsx(Y,{size:13,style:{opacity:.4}}):A==="asc"?e.jsx(te,{size:13}):e.jsx(Y,{size:13})}const C=n(k);return o?e.jsx("div",{className:"flex justify-center py-8",children:e.jsx("div",{className:"w-6 h-6 rounded-full border-2 animate-spin",style:{borderColor:"rgba(139,92,246,0.2)",borderTopColor:"#7c3aed"}})}):e.jsxs("div",{className:"space-y-5",children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wider",style:{color:"#8b5cf6"},children:["Student Results — ",Ct]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:[{icon:_e,label:"Students Attempted",value:c,sub:`${l} total attempt${l!==1?"s":""}`},{icon:Be,label:"Average Score (Best)",value:`${b}%`,sub:"across unique students"},{icon:Se,label:"Passed (≥60%)",value:v,sub:`of ${c} student${c!==1?"s":""}`},{icon:Se,label:"Pass Rate",value:c>0?`${Math.round(v/c*100)}%`:"—",sub:"based on best attempt"}].map(({icon:p,label:y,value:x,sub:j})=>e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.7))",borderColor:"rgba(139,92,246,0.18)"},children:[e.jsx(p,{size:18,style:{color:"#7c3aed",marginBottom:6}}),e.jsx("p",{className:"text-xl font-extrabold",style:{color:"#1e1b4b"},children:x}),e.jsx("p",{className:"text-xs font-semibold mt-0.5",style:{color:"#4c1d95"},children:y}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:"#6b7280"},children:j})]},y))}),c>0&&e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"rgba(255,255,255,0.6)",borderColor:"rgba(139,92,246,0.15)"},children:[e.jsx("p",{className:"text-xs font-semibold mb-3",style:{color:"#4c1d95"},children:"Score Distribution (best attempt per student)"}),e.jsx("div",{className:"flex items-end gap-3",children:E.map((p,y)=>e.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1",children:[e.jsx("p",{className:"text-xs font-bold",style:{color:"#374151"},children:R[y]}),e.jsx("div",{className:"w-full rounded-t-lg transition-all",style:{height:Math.max(4,R[y]/m*80),background:p.color}}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:p.label})]},p.label))})]}),d.length>0&&e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(139,92,246,0.18)"},children:[e.jsxs("div",{className:"px-4 py-3 flex items-center justify-between",style:{background:"linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))"},children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#4c1d95"},children:"Best Score per Student"}),e.jsxs("span",{className:"text-xs px-2 py-0.5 rounded-full font-medium",style:{background:"rgba(167,139,250,0.2)",color:"#6d28d9"},children:[d.length," student",d.length!==1?"s":""]})]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"rgba(245,243,255,0.6)",borderBottom:"1px solid rgba(139,92,246,0.1)"},children:[["name","score","date"].map(p=>e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#5b21b6",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"},onClick:()=>i(p),children:e.jsxs("span",{className:"inline-flex items-center gap-1",children:[p==="name"?"Student":p==="score"?"Best Score":"Last Attempt",e.jsx(u,{k:p})]})},p)),e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#5b21b6",fontSize:11,fontWeight:700},children:"Campus / Section"}),e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#5b21b6",fontSize:11,fontWeight:700},children:"Attempts"})]})}),e.jsx("tbody",{children:n(d).map(p=>{const y=f[p.studentUid]?.length??1,x=p.percentage>=80?"#059669":p.percentage>=60?"#d97706":"#dc2626";return e.jsxs("tr",{style:{borderBottom:"1px solid rgba(139,92,246,0.07)",cursor:"pointer"},onClick:()=>M(z===p.studentUid?null:p.studentUid),children:[e.jsxs("td",{className:"px-4 py-3",children:[e.jsx("p",{className:"font-semibold",style:{color:"#1e1b4b",fontSize:13},children:p.studentName}),p.studentDisplayId&&e.jsx("p",{style:{color:"#9ca3af",fontSize:11},children:p.studentDisplayId})]}),e.jsx("td",{className:"px-4 py-3",children:e.jsxs("span",{className:"inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full",style:{background:p.percentage>=60?"rgba(209,250,229,0.8)":"rgba(254,226,226,0.8)",color:x},children:[p.score,"/",p.total," (",p.percentage,"%)"]})}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:bt(p.completedAt)}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:[p.studentCampus,p.studentSection].filter(Boolean).join(" · ")||"—"}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:y})]},p.studentUid)})})]})})]}),e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(139,92,246,0.18)"},children:[e.jsxs("div",{className:"px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between",style:{background:"linear-gradient(135deg, rgba(245,243,255,0.95), rgba(237,233,254,0.85))"},children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#4c1d95"},children:"All Attempts"}),e.jsx("input",{type:"text",placeholder:"Filter by name, ID, section…",value:S,onChange:p=>D(p.target.value),className:"input-field text-xs py-1.5 w-full sm:w-56"})]}),C.length===0?e.jsx("div",{className:"px-4 py-8 text-center",children:e.jsx("p",{className:"text-sm",style:{color:"#9ca3af"},children:t.length===0?"No quiz submissions yet.":"No results match the filter."})}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"rgba(245,243,255,0.6)",borderBottom:"1px solid rgba(139,92,246,0.1)"},children:[["name","score","date"].map(p=>e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#5b21b6",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"},onClick:()=>i(p),children:e.jsxs("span",{className:"inline-flex items-center gap-1",children:[p==="name"?"Student":p==="score"?"Score":"Submitted",e.jsx(u,{k:p})]})},p)),e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#5b21b6",fontSize:11,fontWeight:700},children:"Campus / Section"})]})}),e.jsx("tbody",{children:C.map((p,y)=>{const x=p.percentage>=80?"#059669":p.percentage>=60?"#d97706":"#dc2626";return e.jsxs("tr",{style:{borderBottom:"1px solid rgba(139,92,246,0.07)",background:y%2===0?"rgba(255,255,255,0.5)":"rgba(245,243,255,0.4)"},children:[e.jsxs("td",{className:"px-4 py-3",children:[e.jsx("p",{className:"font-semibold",style:{color:"#1e1b4b",fontSize:13},children:p.studentName}),p.studentDisplayId&&e.jsx("p",{style:{color:"#9ca3af",fontSize:11},children:p.studentDisplayId})]}),e.jsx("td",{className:"px-4 py-3",children:e.jsxs("span",{className:"inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full",style:{background:p.percentage>=60?"rgba(209,250,229,0.8)":"rgba(254,226,226,0.8)",color:x},children:[p.score,"/",p.total," (",p.percentage,"%)"]})}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:bt(p.completedAt)}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:[p.studentCampus,p.studentSection].filter(Boolean).join(" · ")||"—"})]},p.id)})})]})})]})]})}const nt="erMcqResults",Rt="ER Diagrams & Advanced ER Concepts",H=50,we=90,ne=3,fe=[{id:"er01",category:"ER Diagram Fundamentals",question:"In Chen's ER notation, which shape is used to represent an entity?",choices:["Diamond","Oval","Rectangle","Double rectangle"],correct:2},{id:"er02",category:"ER Diagram Fundamentals",question:"In Chen's ER notation, which shape represents a relationship between entities?",choices:["Rectangle","Diamond","Oval","Double oval"],correct:1},{id:"er03",category:"ER Diagram Fundamentals",question:"What shape is used to represent an attribute in Chen's ER notation?",choices:["Rectangle","Diamond","Oval","Double rectangle"],correct:2},{id:"er04",category:"ER Diagram Fundamentals",question:"What is a key attribute in an ER diagram?",choices:["An attribute that can hold multiple values for a single entity","An attribute whose value uniquely identifies each entity instance","An attribute calculated from other stored attributes","An attribute that can be left empty (NULL)"],correct:1},{id:"er05",category:"ER Diagram Fundamentals",question:"In an ER diagram, what does cardinality describe?",choices:["The data type stored in each attribute","The total number of entities allowed in the database","The number of instances of one entity that can be associated with instances of another","The storage size required for each relationship"],correct:2},{id:"er06",category:"ER Diagram Fundamentals",question:"What is a composite attribute in an ER diagram?",choices:["An attribute that uniquely identifies an entity","An attribute that can store multiple values simultaneously","An attribute made up of multiple sub-attributes (e.g., Full Name = First + Last)","An attribute derived from a calculation on other attributes"],correct:2},{id:"er07",category:"ER Diagram Fundamentals",question:"How is a key attribute distinguished from other attributes in Chen's ER notation?",choices:["It is drawn as a double oval","Its name is underlined","It is placed inside the entity rectangle","It is connected to the entity with a double line"],correct:1},{id:"er08",category:"Relationships & Cardinality",question:"A student can enrol in many courses, and each course can have many students. What relationship type exists between Student and Course?",choices:["One-to-One","One-to-Many","Many-to-One","Many-to-Many"],correct:3},{id:"er09",category:"Relationships & Cardinality",question:"In a hospital, each patient is assigned to exactly one primary doctor, and a doctor can manage many patients. What is the relationship between Doctor and Patient?",choices:["Many-to-Many","One-to-Many","One-to-One","Many-to-One"],correct:1},{id:"er10",category:"Relationships & Cardinality",question:"In an online store, each order belongs to exactly one customer, but a customer can place many orders. What relationship exists between Customer and Order?",choices:["One-to-One","Many-to-Many","One-to-Many","Many-to-One"],correct:2},{id:"er11",category:"Relationships & Cardinality",question:'What does "total participation" mean in an ER diagram?',choices:["Only some entity instances participate in the relationship","Every entity instance must participate in at least one instance of the relationship","The relationship must have a maximum cardinality of one on both sides","All entities in the database are linked to each other"],correct:1},{id:"er12",category:"Relationships & Cardinality",question:'In a university, every faculty member must be assigned to a department, but a department can exist without any assigned faculty. Which entity has total participation in the "Assigned-To" relationship?',choices:["Department","Faculty Member","Both entities","Neither entity"],correct:1},{id:"er13",category:"Relationships & Cardinality",question:"In a hotel system, a room can be booked by many guests over time, and a guest can book many rooms across different stays. What is the relationship between Guest and Room?",choices:["One-to-One","One-to-Many","Many-to-Many","Many-to-One"],correct:2},{id:"er14",category:"Advanced ER Concepts",question:"What is a weak entity in an ER diagram?",choices:["An entity with no attributes","An entity that cannot be uniquely identified by its own attributes alone and depends on an owner entity","An entity with fewer than three attributes","An entity that only participates in one-to-one relationships"],correct:1},{id:"er15",category:"Advanced ER Concepts",question:"How is a weak entity represented in Chen's ER notation?",choices:["Single rectangle","Oval with a dashed border","Double rectangle","Diamond with a double border"],correct:2},{id:"er16",category:"Advanced ER Concepts",question:"What is an identifying relationship in an ER diagram?",choices:["A relationship between two strong entities that share a primary key","The relationship that connects a weak entity to its owner (identifying) entity","A relationship where all participating entities have the same key attribute","A many-to-many relationship that requires a junction table"],correct:1},{id:"er17",category:"Advanced ER Concepts",question:"What is a multivalued attribute in an ER diagram?",choices:["An attribute whose value is calculated from other attributes","An attribute composed of multiple sub-parts","An attribute that can hold more than one value for a single entity instance (e.g., multiple phone numbers)","An attribute that uniquely identifies an entity"],correct:2},{id:"er18",category:"Advanced ER Concepts",question:"How is a multivalued attribute shown in Chen's ER notation?",choices:["Single oval","Dashed oval","Double oval","Underlined name inside a single oval"],correct:2},{id:"er19",category:"Advanced ER Concepts",question:"What is a derived attribute in an ER diagram?",choices:["An attribute that uniquely identifies each entity instance","An attribute that can be computed from other stored attributes (e.g., Age derived from Date of Birth)","An attribute that can store multiple values","An attribute shared between two related entities"],correct:1},{id:"er20",category:"Advanced ER Concepts",question:"What is a partial key (discriminator) in the context of weak entities?",choices:["The primary key of the owner entity copied into the weak entity","A foreign key that links the weak entity to its owner entity","An attribute set that uniquely identifies weak entity instances among those associated with the same owner","The relationship diamond connecting the weak entity to its owner"],correct:2}],be=[...new Set(fe.map(t=>t.category))],vt=["A","B","C","D"];function ls({studentProfile:t,onPassStatusChange:r}){const{user:o}=me(),[h,s]=a.useState("loading"),[w,A]=a.useState({}),[N,z]=a.useState(!1),[M,S]=a.useState(0),[D,f]=a.useState(!1),[g,d]=a.useState([]),[l,c]=a.useState(!1),[b,v]=a.useState(Object.fromEntries(be.map(x=>[x,!0]))),E=fe.length,R=Object.keys(w).length,m=Math.round(R/E*100),k=g.length,n=g.length>0?Math.max(...g.map(x=>x.percentage)):0;a.useEffect(()=>{o&&(async()=>{try{const x=await Re($(U,nt,o.uid));if(x.exists()){const j=x.data(),I=(j.attempts??[]).map(P=>({...P,completedAt:P.completedAt?.toDate?.()??new Date}));d(I),c(j.badgeEarned??!1);const T=(j.bestPercentage??0)>H;r?.(T),I.length>=ne?s("exhausted"):s("intro")}else s("intro")}catch{s("intro")}})()},[o]);function i(x,j){A(I=>({...I,[x]:j}))}function u(x){v(j=>({...j,[x]:!j[x]}))}async function C(){if(!o)return;z(!0);const x=fe.filter(B=>w[B.id]===B.correct).length,j=Math.round(x/E*100);S(x);const T=k===0&&j>=we,P={score:x,total:E,percentage:j,completedAt:new Date},F=[...g,P],O=Math.max(n,j),L=O>H;try{const B=$(U,nt,o.uid);k===0?await Te(B,{studentUid:o.uid,studentName:t?.fullName??o.email??"Unknown",studentDisplayId:t?.studentId??"",studentSection:t?.section??"",studentCampus:t?.campus??"",attempts:[{score:x,total:E,percentage:j,completedAt:new Date}],bestPercentage:j,badgeEarned:T,passed:L,attemptCount:1,firstAttemptAt:se(),lastAttemptAt:se()}):await He(B,{attempts:jt({score:x,total:E,percentage:j,completedAt:new Date}),bestPercentage:O,passed:L,attemptCount:F.length,lastAttemptAt:se()}),T&&(await Te($(U,"students",o.uid),{erMcqBadge:!0},{merge:!0}),c(!0)),r?.(L)}catch{}d(F),s("result"),z(!1),window.scrollTo({top:0,behavior:"smooth"})}function p(){A({}),S(0),f(!1),v(Object.fromEntries(be.map(x=>[x,!0]))),s("intro"),window.scrollTo({top:0,behavior:"smooth"})}if(h==="loading")return e.jsx("div",{className:"flex justify-center py-8",children:e.jsx("div",{className:"w-6 h-6 rounded-full border-2 animate-spin",style:{borderColor:"rgba(99,102,241,0.2)",borderTopColor:"#6366f1"}})});if(h==="exhausted"){const x=g.reduce((I,T)=>T.percentage>I.percentage?T:I,g[0]),j=x.percentage>H;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-2xl p-5 border text-center",style:{background:j?"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))":"linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))",borderColor:j?"rgba(16,185,129,0.25)":"rgba(239,68,68,0.25)"},children:[l&&e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("span",{className:"inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full",style:{background:"rgba(251,191,36,0.2)",color:"#b45309",border:"1px solid rgba(251,191,36,0.4)"},children:[e.jsx(G,{size:14,className:"fill-amber-500 text-amber-500 stroke-0"})," ER Distinction Badge Earned"]})}),e.jsx(he,{size:28,style:{color:j?"#059669":"#dc2626",margin:"0 auto 8px"}}),e.jsxs("p",{className:"text-lg font-bold",style:{color:j?"#065f46":"#991b1b"},children:[ne," attempts used"]}),e.jsxs("p",{className:"text-sm mt-1",style:{color:j?"#047857":"#b91c1c"},children:["Best score: ",e.jsxs("strong",{children:[x.percentage,"%"]})," (",x.score,"/",x.total,")"]}),e.jsx("p",{className:"text-xs mt-2",style:{color:"#6b7280"},children:j?"You have passed this checkpoint. The remaining lessons are unlocked.":`You need more than ${H}% to unlock the next lessons.`})]}),e.jsx(ut,{attempts:g})]})}if(h==="intro"){const x=ne-k;return e.jsxs("div",{className:"space-y-4",children:[l&&e.jsxs("div",{className:"rounded-xl px-4 py-3 flex items-center gap-3",style:{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)"},children:[e.jsx(G,{size:16,className:"fill-amber-500 text-amber-500 stroke-0 shrink-0"}),e.jsx("p",{className:"text-xs font-semibold",style:{color:"#b45309"},children:"You earned the ER Distinction Badge on your first attempt!"})]}),g.length>0&&e.jsx(ut,{attempts:g}),e.jsx("div",{className:"rounded-2xl p-5 border",style:{background:"linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.85))",borderColor:"rgba(99,102,241,0.25)"},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(V,{size:22,style:{color:"#4f46e5",flexShrink:0,marginTop:2}}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#312e81"},children:Rt}),e.jsxs("p",{className:"text-xs mt-1 leading-5",style:{color:"#4338ca"},children:[E," multiple-choice questions across ",be.length," topic areas. Score above ",H,"% to unlock the remaining lessons. Score ",we,"%+ on your ",e.jsx("strong",{children:"first attempt"})," to earn a special badge."]}),e.jsx("div",{className:"flex flex-wrap gap-2 mt-3",children:be.map(j=>e.jsx("span",{className:"text-xs px-2.5 py-0.5 rounded-full font-medium",style:{background:"rgba(129,140,248,0.2)",color:"#4338ca"},children:j},j))}),e.jsxs("div",{className:"flex items-center gap-3 mt-4 flex-wrap",children:[e.jsx("button",{onClick:()=>s("taking"),className:"btn-primary text-sm px-5 py-2",children:k===0?"Start Quiz":`Retake (Attempt ${k+1}/${ne})`}),e.jsxs("span",{className:"text-xs",style:{color:"#6b7280"},children:[x," attempt",x!==1?"s":""," remaining"]})]})]})]})})]})}if(h==="result"){const x=Math.round(M/E*100),j=x>H,I=k===1&&x>=we,T=ne-g.length;return e.jsxs("div",{className:"space-y-5",children:[I&&e.jsxs("div",{className:"rounded-2xl px-5 py-4 text-center border",style:{background:"linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",borderColor:"rgba(251,191,36,0.4)"},children:[e.jsx(G,{size:32,className:"fill-amber-500 text-amber-500 stroke-0 mx-auto mb-2"}),e.jsx("p",{className:"text-sm font-bold",style:{color:"#92400e"},children:"ER Distinction Badge Earned!"}),e.jsxs("p",{className:"text-xs mt-1",style:{color:"#b45309"},children:["You scored ",x,"% on your first attempt — outstanding! A badge has been added to your profile."]})]}),e.jsxs("div",{className:"rounded-2xl p-6 border text-center",style:{background:j?"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))":"linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))",borderColor:j?"rgba(16,185,129,0.25)":"rgba(239,68,68,0.25)"},children:[e.jsx(Ie,{size:36,style:{color:j?"#059669":"#dc2626",margin:"0 auto 8px"}}),e.jsxs("p",{className:"text-3xl font-extrabold",style:{color:j?"#065f46":"#991b1b"},children:[M," / ",E]}),e.jsxs("p",{className:"text-lg font-semibold mt-1",style:{color:j?"#047857":"#b91c1c"},children:[x,"% — ",j?"Passed! Next lessons unlocked.":`Need >${H}% to unlock next lessons.`]}),e.jsx("div",{className:"mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left",children:be.map(P=>{const F=fe.filter(B=>B.category===P),O=F.filter(B=>w[B.id]===B.correct).length,L=Math.round(O/F.length*100);return e.jsxs("div",{className:"rounded-xl px-3 py-2",style:{background:"rgba(255,255,255,0.55)"},children:[e.jsx("p",{className:"text-xs font-semibold",style:{color:"#374151"},children:P}),e.jsxs("p",{className:"text-sm font-bold mt-0.5",style:{color:"#1e1b4b"},children:[O,"/",F.length," ",e.jsxs("span",{className:"text-xs font-normal",style:{color:"#6b7280"},children:["(",L,"%)"]})]})]},P)})})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap",children:[e.jsxs("button",{onClick:()=>f(P=>!P),className:"btn-secondary text-sm px-4 py-2 flex items-center gap-1.5",children:[D?e.jsx(te,{size:16}):e.jsx(Y,{size:16}),D?"Hide Review":"Review Answers"]}),T>0&&e.jsxs("button",{onClick:p,className:"btn-secondary text-sm px-4 py-2 flex items-center gap-1.5",children:[e.jsx(Pe,{size:16}),"Retake (",T," left)"]})]}),D&&e.jsx("div",{className:"space-y-4",children:fe.map((P,F)=>{const O=w[P.id]??-1,L=O===P.correct;return e.jsx("div",{className:"rounded-2xl p-4 border",style:{background:L?"rgba(209,250,229,0.5)":"rgba(254,226,226,0.5)",borderColor:L?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"},children:e.jsxs("div",{className:"flex items-start gap-2",children:[L?e.jsx(K,{size:18,style:{color:"#059669",flexShrink:0,marginTop:2}}):e.jsx(Le,{size:18,style:{color:"#dc2626",flexShrink:0,marginTop:2}}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wide mb-1",style:{color:"#6b7280"},children:["Q",F+1," · ",P.category]}),e.jsx("p",{className:"text-sm font-medium",style:{color:"#1e1b4b"},children:P.question}),e.jsx("div",{className:"mt-2 space-y-1",children:P.choices.map((B,q)=>{const Fe=q===O,ye=q===P.correct;let pe="transparent",Ke="#4b5563";return ye?(pe="rgba(209,250,229,0.8)",Ke="#065f46"):Fe&&!L&&(pe="rgba(254,202,202,0.8)",Ke="#991b1b"),e.jsxs("div",{className:"text-xs px-3 py-1.5 rounded-lg flex items-center gap-2",style:{background:pe,color:Ke},children:[e.jsxs("span",{className:"font-bold",children:[vt[q],"."]})," ",B,ye&&e.jsx(K,{size:13,style:{marginLeft:"auto",color:"#059669"}})]},q)})})]})]})},P.id)})})]})}const y=E-R;return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"rounded-2xl p-4 border sticky top-0 z-10",style:{background:"rgba(238,242,255,0.97)",borderColor:"rgba(99,102,241,0.2)",backdropFilter:"blur(8px)"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#4338ca"},children:[R," of ",E," answered · Attempt ",k+1,"/",ne]}),e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#4338ca"},children:[m,"%"]})]}),e.jsx("div",{className:"w-full rounded-full h-2",style:{background:"rgba(129,140,248,0.25)"},children:e.jsx("div",{className:"h-2 rounded-full transition-all",style:{width:`${m}%`,background:"linear-gradient(90deg, #818cf8, #4f46e5)"}})})]}),be.map(x=>{const j=fe.filter(P=>P.category===x),I=j.filter(P=>w[P.id]!==void 0).length,T=b[x];return e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(99,102,241,0.18)"},children:[e.jsxs("button",{onClick:()=>u(x),className:"w-full flex items-center justify-between px-4 py-3",style:{background:"linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.8))"},children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm font-bold",style:{color:"#312e81"},children:x}),e.jsxs("span",{className:"text-xs px-2 py-0.5 rounded-full font-medium",style:{background:I===j.length?"rgba(209,250,229,0.8)":"rgba(129,140,248,0.2)",color:I===j.length?"#065f46":"#4338ca"},children:[I,"/",j.length]})]}),T?e.jsx(te,{size:16,style:{color:"#6366f1"}}):e.jsx(Y,{size:16,style:{color:"#6366f1"}})]}),T&&e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(99,102,241,0.1)"},children:j.map(P=>{const F=fe.indexOf(P),O=w[P.id]??-1;return e.jsxs("div",{className:"p-4",style:{background:"rgba(255,255,255,0.6)"},children:[e.jsxs("p",{className:"text-xs font-semibold mb-2",style:{color:"#9ca3af"},children:["Question ",F+1]}),e.jsx("p",{className:"text-sm font-medium leading-6",style:{color:"#1e1b4b"},children:P.question}),e.jsx("div",{className:"mt-3 space-y-2",children:P.choices.map((L,B)=>{const q=B===O;return e.jsxs("button",{onClick:()=>i(P.id,B),className:"w-full text-left text-sm rounded-xl px-3 py-2.5 border transition-all flex items-start gap-2",style:{borderColor:q?"#6366f1":"rgba(99,102,241,0.18)",background:q?"linear-gradient(135deg, rgba(224,231,255,0.95), rgba(199,210,254,0.8))":"rgba(255,255,255,0.5)",color:q?"#312e81":"#374151",fontWeight:q?600:400},children:[e.jsx("span",{className:"flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5",style:{background:q?"#6366f1":"rgba(99,102,241,0.12)",color:q?"#fff":"#6366f1"},children:vt[B]}),e.jsx("span",{className:"leading-5",children:L})]},B)})})]},P.id)})})]},x)}),e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.85))",borderColor:"rgba(99,102,241,0.2)"},children:[y>0&&e.jsxs("p",{className:"text-xs mb-3",style:{color:"#92400e",background:"rgba(254,243,199,0.8)",borderRadius:8,padding:"6px 10px"},children:[y," unanswered question",y>1?"s":""," — these will count as incorrect."]}),e.jsx("button",{onClick:C,disabled:N,className:"btn-primary w-full flex items-center justify-center gap-2 py-3",children:N?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 rounded-full border-2 animate-spin",style:{borderColor:"#fff3",borderTopColor:"#fff"}}),"Submitting…"]}):e.jsxs(e.Fragment,{children:[e.jsx(ct,{size:16})," Submit Quiz"]})})]})]})}function ut({attempts:t}){return t.length===0?null:e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(99,102,241,0.15)"},children:[e.jsx("div",{className:"px-4 py-3",style:{background:"linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.8))"},children:e.jsx("p",{className:"text-xs font-bold",style:{color:"#312e81"},children:"Your Previous Attempts"})}),e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(99,102,241,0.08)"},children:t.map((r,o)=>{const h=r.percentage>H;return e.jsxs("div",{className:"flex items-center justify-between px-4 py-3",style:{background:"rgba(255,255,255,0.6)"},children:[e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#6b7280"},children:["Attempt ",o+1]}),e.jsxs("span",{className:"text-xs font-bold px-2.5 py-1 rounded-full",style:{background:h?"rgba(209,250,229,0.8)":"rgba(254,226,226,0.8)",color:h?"#065f46":"#991b1b"},children:[r.score,"/",r.total," (",r.percentage,"%)"]})]},o)})})]})}function wt(t){return t.toLocaleString("en-NZ",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function ns(){const[t,r]=a.useState([]),[o,h]=a.useState(!0),[s,w]=a.useState("date"),[A,N]=a.useState("desc"),[z,M]=a.useState(""),[S,D]=a.useState(null);a.useEffect(()=>{const i=ft(ze(U,nt),gt("lastAttemptAt","desc")),u=ht(i,C=>{const p=C.docs.map(y=>{const x=y.data();return{studentUid:x.studentUid??y.id,studentName:x.studentName??"Unknown",studentDisplayId:x.studentDisplayId??"",studentSection:x.studentSection??"",studentCampus:x.studentCampus??"",attempts:(x.attempts??[]).map(j=>({...j,completedAt:j.completedAt?.toDate?.()??new Date})),bestPercentage:x.bestPercentage??0,badgeEarned:x.badgeEarned??!1,passed:x.passed??!1,attemptCount:x.attemptCount??0,lastAttemptAt:x.lastAttemptAt?.toDate?.()??new Date}});r(p),h(!1)});return()=>u()},[]);const f=t.length,g=t.filter(i=>i.passed).length,d=t.filter(i=>i.badgeEarned).length,l=f>0?Math.round(t.reduce((i,u)=>i+u.bestPercentage,0)/f):0,c=[{label:"0–49%",min:0,max:49,color:"#fca5a5"},{label:"50–69%",min:50,max:69,color:"#fcd34d"},{label:"70–89%",min:70,max:89,color:"#6ee7b7"},{label:"90–100%",min:90,max:100,color:"#818cf8"}],b=c.map(i=>t.filter(u=>u.bestPercentage>=i.min&&u.bestPercentage<=i.max).length),v=Math.max(...b,1),E=t.filter(i=>{const u=z.toLowerCase();return!u||i.studentName.toLowerCase().includes(u)||i.studentDisplayId.toLowerCase().includes(u)||i.studentSection.toLowerCase().includes(u)||i.studentCampus.toLowerCase().includes(u)});function R(i){return[...i].sort((u,C)=>{let p=0;return s==="name"?p=u.studentName.localeCompare(C.studentName):s==="score"?p=u.bestPercentage-C.bestPercentage:s==="attempts"?p=u.attemptCount-C.attemptCount:p=u.lastAttemptAt.getTime()-C.lastAttemptAt.getTime(),A==="asc"?p:-p})}function m(i){s===i?N(u=>u==="asc"?"desc":"asc"):(w(i),N("desc"))}function k({k:i}){return s!==i?e.jsx(Y,{size:13,style:{opacity:.4}}):A==="asc"?e.jsx(te,{size:13}):e.jsx(Y,{size:13})}if(o)return e.jsx("div",{className:"flex justify-center py-8",children:e.jsx("div",{className:"w-6 h-6 rounded-full border-2 animate-spin",style:{borderColor:"rgba(99,102,241,0.2)",borderTopColor:"#6366f1"}})});const n=R(E);return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wider",style:{color:"#6366f1"},children:["Student Results — ",Rt]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:[{icon:_e,label:"Students Attempted",value:f,sub:`max ${ne} attempts each`},{icon:Be,label:"Average Best Score",value:`${l}%`,sub:"across all students"},{icon:Se,label:`Passed (>${H}%)`,value:g,sub:`of ${f} student${f!==1?"s":""}`},{icon:G,label:`Distinction Badge (≥${we}% 1st)`,value:d,sub:"first-attempt distinction"}].map(({icon:i,label:u,value:C,sub:p})=>e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(238,242,255,0.9), rgba(224,231,255,0.7))",borderColor:"rgba(99,102,241,0.18)"},children:[e.jsx(i,{size:18,style:{color:"#6366f1",marginBottom:6}}),e.jsx("p",{className:"text-xl font-extrabold",style:{color:"#1e1b4b"},children:C}),e.jsx("p",{className:"text-xs font-semibold mt-0.5",style:{color:"#312e81"},children:u}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:"#6b7280"},children:p})]},u))}),f>0&&e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"rgba(255,255,255,0.6)",borderColor:"rgba(99,102,241,0.15)"},children:[e.jsx("p",{className:"text-xs font-semibold mb-3",style:{color:"#312e81"},children:"Score Distribution (best attempt per student)"}),e.jsx("div",{className:"flex items-end gap-3",children:c.map((i,u)=>e.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1",children:[e.jsx("p",{className:"text-xs font-bold",style:{color:"#374151"},children:b[u]}),e.jsx("div",{className:"w-full rounded-t-lg transition-all",style:{height:Math.max(4,b[u]/v*80),background:i.color}}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:i.label})]},i.label))}),e.jsxs("div",{className:"mt-3 flex items-center gap-4 text-xs",style:{color:"#6b7280"},children:[e.jsxs("span",{children:["Pass threshold: >",H,"%"]}),e.jsx("span",{children:"·"}),e.jsxs("span",{children:["Distinction (badge): ≥",we,"% on 1st attempt"]})]})]}),e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(99,102,241,0.18)"},children:[e.jsxs("div",{className:"px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between",style:{background:"linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.85))"},children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#312e81"},children:"All Students"}),e.jsx("input",{type:"text",placeholder:"Filter by name, ID, section…",value:z,onChange:i=>M(i.target.value),className:"input-field text-xs py-1.5 w-full sm:w-56"})]}),n.length===0?e.jsx("div",{className:"px-4 py-8 text-center",children:e.jsx("p",{className:"text-sm",style:{color:"#9ca3af"},children:t.length===0?"No quiz submissions yet.":"No results match the filter."})}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"rgba(238,242,255,0.6)",borderBottom:"1px solid rgba(99,102,241,0.1)"},children:[[{k:"name",label:"Student"},{k:"score",label:"Best Score"},{k:"attempts",label:"Attempts"},{k:"date",label:"Last Attempt"}].map(({k:i,label:u})=>e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#4338ca",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"},onClick:()=>m(i),children:e.jsxs("span",{className:"inline-flex items-center gap-1",children:[u," ",e.jsx(k,{k:i})]})},i)),e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#4338ca",fontSize:11,fontWeight:700},children:"Status"})]})}),e.jsx("tbody",{children:n.map((i,u)=>{const C=i.bestPercentage>H?i.bestPercentage>=we?"#059669":"#d97706":"#dc2626",p=S===i.studentUid;return e.jsxs(e.Fragment,{children:[e.jsxs("tr",{style:{borderBottom:p?"none":"1px solid rgba(99,102,241,0.07)",background:u%2===0?"rgba(255,255,255,0.5)":"rgba(238,242,255,0.35)",cursor:"pointer"},onClick:()=>D(p?null:i.studentUid),children:[e.jsxs("td",{className:"px-4 py-3",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("p",{className:"font-semibold",style:{color:"#1e1b4b",fontSize:13},children:i.studentName}),i.badgeEarned&&e.jsx(G,{size:13,className:"fill-amber-500 text-amber-500 stroke-0"})]}),i.studentDisplayId&&e.jsx("p",{style:{color:"#9ca3af",fontSize:11},children:i.studentDisplayId}),(i.studentCampus||i.studentSection)&&e.jsx("p",{style:{color:"#9ca3af",fontSize:11},children:[i.studentCampus,i.studentSection].filter(Boolean).join(" · ")})]}),e.jsx("td",{className:"px-4 py-3",children:e.jsxs("span",{className:"inline-flex items-center font-bold text-xs px-2.5 py-1 rounded-full",style:{background:i.passed?"rgba(209,250,229,0.8)":"rgba(254,226,226,0.8)",color:C},children:[i.bestPercentage,"%"]})}),e.jsxs("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:[i.attemptCount,"/",ne]}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:wt(i.lastAttemptAt)}),e.jsx("td",{className:"px-4 py-3",children:e.jsx("span",{className:"text-xs font-semibold px-2 py-0.5 rounded-full",style:{background:i.passed?"rgba(209,250,229,0.7)":"rgba(254,226,226,0.7)",color:i.passed?"#065f46":"#991b1b"},children:i.passed?"Passed":"Not Passed"})})]},i.studentUid),p&&e.jsx("tr",{style:{borderBottom:"1px solid rgba(99,102,241,0.07)"},children:e.jsx("td",{colSpan:5,className:"px-4 pb-3 pt-0",style:{background:u%2===0?"rgba(255,255,255,0.5)":"rgba(238,242,255,0.35)"},children:e.jsxs("div",{className:"rounded-xl overflow-hidden border",style:{borderColor:"rgba(99,102,241,0.12)"},children:[e.jsx("div",{className:"px-3 py-2",style:{background:"rgba(238,242,255,0.8)"},children:e.jsx("p",{className:"text-xs font-bold",style:{color:"#4338ca"},children:"Attempt History"})}),e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(99,102,241,0.08)"},children:i.attempts.map((y,x)=>e.jsxs("div",{className:"flex items-center justify-between px-3 py-2",style:{background:"rgba(255,255,255,0.7)"},children:[e.jsxs("span",{className:"text-xs",style:{color:"#6b7280"},children:["Attempt ",x+1,x===0&&i.badgeEarned&&e.jsx(G,{size:11,className:"fill-amber-500 text-amber-500 stroke-0 inline ml-1"})]}),e.jsxs("span",{className:"text-xs font-semibold",style:{color:y.percentage>H?"#059669":"#dc2626"},children:[y.score,"/",y.total," (",y.percentage,"%) · ",wt(y.completedAt)]})]},x))})]})})},`${i.studentUid}-expanded`)]})})})]})})]})]})}const ds=`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

:root {
    --navy:   #1C1E2E;
    --navy2:  #252840;
    --white:  #F8F9FC;
    --blue:   #4A8EF5;
    --blue2:  #2563EB;
    --green:  #34D399;
    --yellow: #FBBF24;
    --red:    #F87171;
    --gray:   #6B7280;
    --gray2:  #E5E7EB;
    --code-bg:#1E1E2E;
    --sans: 'Plus Jakarta Sans', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
.sqld * { box-sizing: border-box; margin: 0; padding: 0; }
.sqld section {
    width: 100%; height: 100%;
    font-family: var(--sans);
    color: var(--navy);
    background: var(--white);
    display: flex; flex-direction: column;
    position: relative;
  }
.sqld section.dark {
    background: var(--navy);
    color: var(--white);
  }
.sqld section.dark .tag { background: rgba(74,142,245,.25); color: var(--blue); }
.sqld .tag {
    display: inline-block;
    background: rgba(74,142,245,.12);
    color: var(--blue2);
    font-size: 24px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 6px 18px; border-radius: 6px;
    font-family: var(--mono);
    margin-bottom: 28px;
  }
.sqld .slide-title {
    font-size: 68px; font-weight: 800; line-height: 1.1;
    letter-spacing: -.02em;
  }
.sqld .slide-subtitle {
    font-size: 36px; font-weight: 500; line-height: 1.45;
    opacity: .7; margin-top: 20px;
  }
.sqld .body-text { font-size: 34px; font-weight: 400; line-height: 1.55; }
.sqld .small-text { font-size: 28px; line-height: 1.5; }
.sqld .label { font-size: 24px; font-weight: 600; opacity: .55; text-transform: uppercase; letter-spacing: .08em; }
.sqld .pad { padding: 90px 110px 80px; }
.sqld .pad-sm { padding: 70px 110px 0; }
.sqld .col2 { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.sqld .col3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
.sqld .gap { margin-top: 52px; }
.sqld .gap-sm { margin-top: 28px; }
.sqld .code-block {
    background: var(--code-bg);
    border-radius: 16px;
    padding: 36px 44px;
    font-family: var(--mono);
    font-size: 30px;
    line-height: 1.7;
    color: #CDD6F4;
    position: relative;
    border: 1px solid rgba(255,255,255,.06);
  }
.sqld .code-block .kw { color: #89B4FA; font-weight: 700; }
.sqld .code-block .fn { color: #94E2D5; }
.sqld .code-block .str { color: #A6E3A1; }
.sqld .code-block .num { color: #FAB387; }
.sqld .code-block .cmt { color: #585B70; font-style: italic; }
.sqld .code-block .tbl { color: #F38BA8; }
.sqld .code-block .col { color: #CBA6F7; }
.sqld .code-block .op { color: #89DCEB; }
.sqld .code-label {
    font-family: var(--mono);
    font-size: 24px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-bottom: 12px;
    opacity: .45;
  }
.sqld .result-table {
    border-radius: 12px;
    overflow: hidden;
    font-family: var(--mono);
    font-size: 26px;
    width: 100%;
    border-collapse: collapse;
  }
.sqld .result-table th {
    background: var(--blue2);
    color: #fff;
    padding: 14px 24px;
    text-align: left;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: .04em;
  }
.sqld .result-table td {
    padding: 13px 24px;
    border-bottom: 1px solid var(--gray2);
    background: #fff;
  }
.sqld .result-table tr:last-child td { border-bottom: none; }
.sqld .result-table tr:nth-child(even) td { background: #F0F4FF; }
.sqld .result-label {
    font-size: 24px; font-weight: 700; color: var(--green);
    font-family: var(--mono); text-transform: uppercase;
    letter-spacing: .08em; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
.sqld .result-label::before { content: '▶ '; opacity: .6; }
.sqld .card {
    background: #fff;
    border-radius: 16px;
    padding: 36px;
    border: 1.5px solid var(--gray2);
  }
.sqld .card.blue-card {
    background: #EFF6FF;
    border-color: #BFDBFE;
  }
.sqld .card.green-card {
    background: #ECFDF5;
    border-color: #6EE7B7;
  }
.sqld .card.dark-card {
    background: var(--navy2);
    border-color: rgba(255,255,255,.08);
    color: var(--white);
  }
.sqld .card-title {
    font-size: 30px; font-weight: 700; margin-bottom: 12px;
  }
.sqld .card-

  
  .badge {
    display: inline-block;
    padding: 5px 16px;
    border-radius: 999px;
    font-size: 24px; font-weight: 600;
    font-family: var(--mono);
  }
.sqld .badge-blue { background: #DBEAFE; color: var(--blue2); }
.sqld .badge-green { background: #D1FAE5; color: #059669; }
.sqld .badge-red { background: #FEE2E2; color: #DC2626; }
.sqld .badge-yellow { background: #FEF3C7; color: #D97706; }
.sqld .arrow-right {
    display: flex; align-items: center;
    font-size: 32px; color: var(--blue); font-weight: 700;
    gap: 12px; margin: 16px 0;
  }
.sqld .section-num {
    font-family: var(--mono);
    font-size: 24px; font-weight: 700;
    color: var(--blue);
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
.sqld .hero-num {
    font-size: 180px; font-weight: 800;
    line-height: 1; opacity: .05;
    font-family: var(--mono);
    position: absolute; right: 60px; bottom: 20px;
    color: var(--blue);
    pointer-events: none;
    z-index: 0;
  }
.sqld .db-diagram { display: flex; flex-direction: column; gap: 0; }
.sqld .db-layer {
    border-radius: 12px;
    padding: 20px 28px;
    font-family: var(--mono);
    font-size: 26px; font-weight: 600;
    text-align: center;
  }
.sqld .db-arrow {
    display: flex; justify-content: center;
    font-size: 28px; color: var(--gray); padding: 4px 0;
  }
.sqld .highlight-box {
    border-left: 5px solid var(--blue);
    padding: 20px 28px;
    background: rgba(74,142,245,.07);
    border-radius: 0 12px 12px 0;
    font-size: 30px;
    line-height: 1.5;
  }
.sqld .highlight-box.green { border-color: var(--green); background: rgba(52,211,153,.07); }
.sqld .highlight-box.yellow { border-color: var(--yellow); background: rgba(251,191,36,.07); }
.sqld .step-list { list-style: none; display: flex; flex-direction: column; gap: 24px; }
.sqld .step-list li {
    display: flex; align-items: flex-start; gap: 20px;
    font-size: 32px; line-height: 1.4;
  }
.sqld .step-num {
    min-width: 44px; height: 44px;
    background: var(--blue2); color: #fff;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 22px; font-family: var(--mono);
    margin-top: 2px; flex-shrink: 0;
  }
.sqld .dtype-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
.sqld .dtype-card {
    border-radius: 14px;
    padding: 28px 30px;
    border: 2px solid transparent;
  }
.sqld .dtype-name {
    font-family: var(--mono);
    font-size: 28px; font-weight: 700;
    margin-bottom: 8px;
  }
.sqld .dtype-desc { font-size: 25px; opacity: .75; line-height: 1.4; }
.sqld .dtype-eg { font-family: var(--mono); font-size: 24px; opacity: .55; margin-top: 6px; }
.sqld .join-circles {
    display: flex; align-items: center; justify-content: center;
    position: relative; height: 200px;
  }
.sqld .slide-footer {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 0 110px;
    height: 80px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 24px;
    border-top: 1px solid rgba(0,0,0,.07);
  }
.sqld section.dark .slide-footer {
    color: var(--white);
    border-top-color: rgba(255,255,255,.08);
  }
.sqld .footer-left { display:flex; align-items:center; gap:14px; opacity:.5; white-space:nowrap; }
.sqld .footer-right { display:flex; align-items:center; gap:10px; opacity:.45; font-family:var(--mono); white-space:nowrap; }
.sqld .footer-dot { width:4px; height:4px; border-radius:50%; background:currentColor; opacity:.5; }
.sqld .code-line { display: block; }
.sqld .big-stat { font-size: 120px; font-weight: 800; line-height: 1; font-family: var(--mono); color: var(--blue); }
.sqld .where-demo { display: flex; align-items: center; gap: 32px; font-family: var(--mono); font-size: 28px; }
.sqld code {
    font-family: var(--mono);
    background: rgba(74,142,245,.12);
    color: var(--blue2);
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 1em;
  }
.sqld section.dark code { background: rgba(137,180,250,.15); color: #89B4FA; }`,Ee=[{classes:"dark",label:"01 Title",html:`<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;">
      <!-- grid decoration -->
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="opacity:.06">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#4A8EF5" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <!-- glowing circle -->
      <div style="position:absolute;top:-200px;right:-100px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(74,142,245,.18) 0%,transparent 70%);"></div>
      <div style="position:absolute;bottom:-150px;left:-80px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.1) 0%,transparent 70%);"></div>
    </div>

    <div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:100px 130px;">
      <div class="section-num">MBI802 · Database Management Systems</div>
      <div class="slide-title" style="color:#fff;font-size:90px;max-width:1100px;line-height:1.05;">
        Introduction to<br/><span style="color:var(--blue);">SQL</span> with MySQL
      </div>
      <div class="slide-subtitle" style="max-width:800px;margin-top:32px;">
        From databases to your first queries — a beginner-friendly guide to structured data.
      </div>

      <!-- terminal decoration -->
      <div style="margin-top:70px;display:flex;align-items:center;gap:16px;">
        <div style="width:14px;height:14px;border-radius:50%;background:#F87171;"></div>
        <div style="width:14px;height:14px;border-radius:50%;background:#FBBF24;"></div>
        <div style="width:14px;height:14px;border-radius:50%;background:#34D399;"></div>
        <div style="font-family:var(--mono);font-size:26px;color:#6B7280;margin-left:8px;">mysql&gt; <span style="color:#89B4FA;">SELECT</span> * <span style="color:#89B4FA;">FROM</span> <span style="color:#F38BA8;">knowledge</span>;<span style="animation:blink 1s step-end infinite;color:#fff;">█</span></div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"dark",label:"03 What is SQL",html:`<div class="pad" style="display:flex;flex-direction:column;height:100%;padding-bottom:88px;position:relative;">

      <div class="tag">The Language</div>
      <div class="slide-title" style="color:#fff;">What is SQL?</div>

      <div class="col2 gap" style="flex:1;">
        <div style="display:flex;flex-direction:column;gap:32px;">
          <div class="body-text" style="color:rgba(255,255,255,.85);">
            <strong style="color:#fff;">SQL</strong> (Structured Query Language) is the standard language for talking to relational databases.
          </div>

          <div style="display:flex;flex-direction:column;gap:20px;">
            <div class="card dark-card" style="border-color:rgba(74,142,245,.3);">
              <div class="card-title" style="color:var(--blue);font-family:var(--mono);">CREATE</div>
              <div class="card-body" style="color:rgba(255,255,255,.7);">Make databases and tables</div>
            </div>
            <div class="card dark-card" style="border-color:rgba(74,142,245,.3);">
              <div class="card-title" style="color:var(--green);font-family:var(--mono);">INSERT / SELECT</div>
              <div class="card-body" style="color:rgba(255,255,255,.7);">Add and read data</div>
            </div>
            <div class="card dark-card" style="border-color:rgba(74,142,245,.3);">
              <div class="card-title" style="color:var(--yellow);font-family:var(--mono);">UPDATE / DELETE</div>
              <div class="card-body" style="color:rgba(255,255,255,.7);">Modify and remove data</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;justify-content:center;gap:24px;">
          <div style="font-size:26px;color:rgba(255,255,255,.5);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">MySQL = SQL + Database Server</div>

          <!-- MySQL logo style box -->
          <div style="background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:18px;padding:36px;display:flex;flex-direction:column;gap:20px;">
            <div style="display:flex;align-items:center;gap:20px;">
              <div style="width:60px;height:60px;background:var(--blue2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:#fff;font-family:var(--mono);">M</div>
              <div>
                <div style="font-size:32px;font-weight:700;color:#fff;">MySQL</div>
                <div style="font-size:24px;color:rgba(255,255,255,.5);">The world's most popular open-source database</div>
              </div>
            </div>
            <div style="width:100%;height:1px;background:rgba(255,255,255,.08);"></div>
            <div style="font-size:26px;color:rgba(255,255,255,.6);line-height:1.5;">
              Used by <strong style="color:#fff;">Facebook, Twitter, YouTube</strong> and thousands of other applications worldwide.
            </div>
          </div>

          <div class="highlight-box" style="border-color:var(--green);background:rgba(52,211,153,.08);">
            <span style="color:var(--green);font-weight:700;">SQL is not case-sensitive</span> — <code>SELECT</code> = <code>select</code> = <code>Select</code>. But writing keywords in UPPERCASE is standard practice.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"04 MySQL Data Types",html:`<div class="pad-sm" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Building Blocks</div>
      <div class="slide-title">MySQL Data Types</div>
      <div class="body-text gap-sm" style="opacity:.6;">Every column in a table must have a data type — it tells MySQL <strong>what kind of value</strong> to expect.</div>

      <div class="dtype-grid gap">
        <div class="dtype-card" style="background:#EFF6FF;border-color:#BFDBFE;">
          <div class="dtype-name" style="color:var(--blue2);">INT</div>
          <div class="dtype-desc">Whole numbers</div>
          <div class="dtype-eg">e.g. 1, 25, 1000</div>
        </div>
        <div class="dtype-card" style="background:#EFF6FF;border-color:#BFDBFE;">
          <div class="dtype-name" style="color:var(--blue2);">FLOAT / DECIMAL</div>
          <div class="dtype-desc">Decimal numbers</div>
          <div class="dtype-eg">e.g. 3.14, 99.99</div>
        </div>
        <div class="dtype-card" style="background:#EFF6FF;border-color:#BFDBFE;">
          <div class="dtype-name" style="color:var(--blue2);">BIGINT</div>
          <div class="dtype-desc">Very large whole numbers</div>
          <div class="dtype-eg">e.g. 9,223,372,036…</div>
        </div>
        <div class="dtype-card" style="background:#ECFDF5;border-color:#6EE7B7;">
          <div class="dtype-name" style="color:#059669;">VARCHAR(n)</div>
          <div class="dtype-desc">Text up to <em>n</em> characters</div>
          <div class="dtype-eg">e.g. 'Alice', 'Hello'</div>
        </div>
        <div class="dtype-card" style="background:#ECFDF5;border-color:#6EE7B7;">
          <div class="dtype-name" style="color:#059669;">TEXT</div>
          <div class="dtype-desc">Long text (no length limit)</div>
          <div class="dtype-eg">e.g. blog post content</div>
        </div>
        <div class="dtype-card" style="background:#ECFDF5;border-color:#6EE7B7;">
          <div class="dtype-name" style="color:#059669;">CHAR(n)</div>
          <div class="dtype-desc">Fixed-length text</div>
          <div class="dtype-eg">e.g. country codes 'MY'</div>
        </div>
        <div class="dtype-card" style="background:#FEF3C7;border-color:#FCD34D;">
          <div class="dtype-name" style="color:#D97706;">DATE</div>
          <div class="dtype-desc">Calendar date</div>
          <div class="dtype-eg">e.g. '2024-09-01'</div>
        </div>
        <div class="dtype-card" style="background:#FEF3C7;border-color:#FCD34D;">
          <div class="dtype-name" style="color:#D97706;">DATETIME</div>
          <div class="dtype-desc">Date + time combined</div>
          <div class="dtype-eg">e.g. '2024-09-01 09:30:00'</div>
        </div>
        <div class="dtype-card" style="background:#FEE2E2;border-color:#FCA5A5;">
          <div class="dtype-name" style="color:#DC2626;">BOOLEAN</div>
          <div class="dtype-desc">True or False (1 or 0)</div>
          <div class="dtype-eg">e.g. is_active = TRUE</div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"05 CREATE",html:`<div class="pad-sm" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Command 1 of 5</div>
      <div class="slide-title">Creating Databases &amp; Tables</div>

      <div class="col2 gap" style="flex:1;align-items:start;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-label">Step 1 — Create a Database</div>
          <div class="code-block">
            <span class="kw">CREATE DATABASE</span> <span class="tbl">school_db</span>;<br/>
            <span class="kw">USE</span> <span class="tbl">school_db</span>;
          </div>

          <div class="code-label" style="margin-top:12px;">Step 2 — Create a Table</div>
          <div class="code-block" style="font-size:27px;">
            <span class="kw">CREATE TABLE</span> <span class="tbl">students</span> (<br/>
            &nbsp;&nbsp;<span class="col">id</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">INT</span> <span class="kw">PRIMARY KEY</span>,<br/>
            &nbsp;&nbsp;<span class="col">name</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">VARCHAR</span>(<span class="num">100</span>),<br/>
            &nbsp;&nbsp;<span class="col">age</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">INT</span>,<br/>
            &nbsp;&nbsp;<span class="col">email</span>&nbsp;&nbsp;&nbsp;<span class="fn">VARCHAR</span>(<span class="num">150</span>),<br/>
            &nbsp;&nbsp;<span class="col">gpa</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">DECIMAL</span>(<span class="num">3</span>,<span class="num">2</span>)<br/>
            );
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="card blue-card" style="padding:28px 32px;">
            <div class="card-title" style="color:var(--blue2);font-size:26px;margin-bottom:16px;">🔑 Key Concepts</div>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:14px;">
              <li style="display:flex;gap:14px;align-items:flex-start;font-size:26px;"><span style="color:var(--blue2);font-weight:700;font-family:var(--mono);">PRIMARY KEY</span><span style="opacity:.8;">— unique identifier for each row</span></li>
              <li style="display:flex;gap:14px;align-items:flex-start;font-size:26px;"><span style="color:var(--blue2);font-weight:700;font-family:var(--mono);">VARCHAR(n)</span><span style="opacity:.8;">— text up to <em>n</em> characters</span></li>
              <li style="display:flex;gap:14px;align-items:flex-start;font-size:26px;"><span style="color:var(--blue2);font-weight:700;font-family:var(--mono);">DECIMAL(3,2)</span><span style="opacity:.8;">— 3 digits, 2 after decimal (e.g. 3.75)</span></li>
            </ul>
          </div>

          <!-- result viz -->
          <div style="margin-top:8px;">
            <div class="result-label">Result — empty table created</div>
            <table class="result-table">
              <thead><tr><th>id</th><th>name</th><th>age</th><th>email</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td colspan="5" style="text-align:center;color:#9CA3AF;font-style:italic;padding:18px;">(no rows yet)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"06 INSERT INTO",html:`<div class="pad-sm" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Command 2 of 5</div>
      <div class="slide-title">Inserting Data</div>

      <div class="col2 gap" style="flex:1;align-items:start;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:28px;">
            <span class="kw">INSERT INTO</span> <span class="tbl">table_name</span><br/>
            &nbsp;&nbsp;(<span class="col">column1</span>, <span class="col">column2</span>, ...)<br/>
            <span class="kw">VALUES</span><br/>
            &nbsp;&nbsp;(<span class="str">value1</span>, <span class="str">value2</span>, ...);
          </div>

          <div class="code-label" style="margin-top:12px;">Example — Insert 3 students</div>
          <div class="code-block" style="font-size:26px;">
            <span class="kw">INSERT INTO</span> <span class="tbl">students</span> (<span class="col">id</span>, <span class="col">name</span>, <span class="col">age</span>, <span class="col">email</span>, <span class="col">gpa</span>)<br/>
            <span class="kw">VALUES</span><br/>
            &nbsp;&nbsp;(<span class="num">1</span>, <span class="str">'Alice'</span>, <span class="num">20</span>, <span class="str">'alice@uni.edu'</span>, <span class="num">3.80</span>),<br/>
            &nbsp;&nbsp;(<span class="num">2</span>, <span class="str">'Bob'</span>,&nbsp;&nbsp; <span class="num">22</span>, <span class="str">'bob@uni.edu'</span>,&nbsp;&nbsp;<span class="num">3.50</span>),<br/>
            &nbsp;&nbsp;(<span class="num">3</span>, <span class="str">'Carol'</span>, <span class="num">21</span>, <span class="str">'carol@uni.edu'</span>,<span class="num">3.90</span>);
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- anatomy labels -->
          <div style="background:#F8F9FC;border-radius:14px;padding:28px;border:1.5px solid var(--gray2);">
            <div style="font-size:26px;font-weight:700;margin-bottom:18px;color:var(--navy);">Anatomy of INSERT</div>
            <div style="display:flex;flex-direction:column;gap:14px;">
              <div style="display:flex;align-items:center;gap:14px;font-size:26px;">
                <span class="badge badge-blue">INSERT INTO</span> <span style="opacity:.7;">which table to add rows to</span>
              </div>
              <div style="display:flex;align-items:center;gap:14px;font-size:26px;">
                <span class="badge badge-blue">(columns)</span> <span style="opacity:.7;">which columns you're filling</span>
              </div>
              <div style="display:flex;align-items:center;gap:14px;font-size:26px;">
                <span class="badge badge-green">VALUES</span> <span style="opacity:.7;">the actual data — match column order!</span>
              </div>
            </div>
          </div>

          <div class="result-label">Result — students table now has rows</div>
          <table class="result-table">
            <thead><tr><th>id</th><th>name</th><th>age</th><th>gpa</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Alice</td><td>20</td><td>3.80</td></tr>
              <tr><td>2</td><td>Bob</td><td>22</td><td>3.50</td></tr>
              <tr><td>3</td><td>Carol</td><td>21</td><td>3.90</td></tr>
            </tbody>
          </table>

          <div class="highlight-box green" style="font-size:26px;">
            💡 You must supply a value for <code>id</code> — it is the PRIMARY KEY and must be unique for every row.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"dark",label:"07 SELECT",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:60px 110px 0;;padding-bottom:88px">
      <div class="tag">Command 3 of 5</div>
      <div class="slide-title" style="color:#fff;">Querying Data with SELECT</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:36px;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="code-label" style="color:rgba(255,255,255,.4);">Select ALL columns</div>
          <div class="code-block" style="font-size:28px;padding:24px 36px;">
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span>;
          </div>
          <div class="code-label" style="color:rgba(255,255,255,.4);">Select SPECIFIC columns</div>
          <div class="code-block" style="font-size:28px;padding:24px 36px;">
            <span class="kw">SELECT</span> <span class="col">name</span>, <span class="col">gpa</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span>;
          </div>
          <div class="code-label" style="color:rgba(255,255,255,.4);">Select with an alias</div>
          <div class="code-block" style="font-size:28px;padding:24px 36px;">
            <span class="kw">SELECT</span> <span class="col">name</span> <span class="kw">AS</span> <span class="str">'Student Name'</span>,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="col">gpa</span>&nbsp; <span class="kw">AS</span> <span class="str">'Grade Point'</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div style="background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:22px;">
            <div style="font-size:24px;color:rgba(255,255,255,.5);font-weight:600;margin-bottom:12px;text-transform:uppercase;letter-spacing:.08em;">SELECT * → all columns</div>
            <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
              <thead>
                <tr>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">id</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">name</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">age</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">email</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">gpa</th>
                </tr>
              </thead>
              <tbody>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);">
                  <td style="padding:7px 14px;">1</td><td style="padding:7px 14px;">Alice</td><td style="padding:7px 14px;">20</td><td style="padding:7px 14px;">alice@…</td><td style="padding:7px 14px;">3.80</td>
                </tr>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);">
                  <td style="padding:7px 14px;">2</td><td style="padding:7px 14px;">Bob</td><td style="padding:7px 14px;">22</td><td style="padding:7px 14px;">bob@…</td><td style="padding:7px 14px;">3.50</td>
                </tr>
                <tr style="color:#CDD6F4;">
                  <td style="padding:7px 14px;">3</td><td style="padding:7px 14px;">Carol</td><td style="padding:7px 14px;">21</td><td style="padding:7px 14px;">carol@…</td><td style="padding:7px 14px;">3.90</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:22px;">
            <div style="font-size:24px;color:rgba(255,255,255,.5);font-weight:600;margin-bottom:12px;text-transform:uppercase;letter-spacing:.08em;">SELECT name, gpa → 2 columns only</div>
            <table style="border-collapse:collapse;font-family:var(--mono);font-size:24px;">
              <thead>
                <tr>
                  <th style="background:var(--blue2);color:#fff;padding:8px 20px;text-align:left;">name</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 20px;text-align:left;">gpa</th>
                </tr>
              </thead>
              <tbody>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);"><td style="padding:7px 20px;">Alice</td><td style="padding:7px 20px;">3.80</td></tr>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);"><td style="padding:7px 20px;">Bob</td><td style="padding:7px 20px;">3.50</td></tr>
                <tr style="color:#CDD6F4;"><td style="padding:7px 20px;">Carol</td><td style="padding:7px 20px;">3.90</td></tr>
              </tbody>
            </table>
          </div>
          <div class="highlight-box" style="border-color:var(--yellow);background:rgba(251,191,36,.08);font-size:26px;color:rgba(255,255,255,.8);">
            ⭐ Use <code>SELECT *</code> for exploration; use specific columns in real apps for speed.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"08 WHERE",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Filtering</div>
      <div class="slide-title">Filtering with WHERE</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">SELECT</span> <span class="col">columns</span><br/>
            <span class="kw">FROM</span> <span class="tbl">table</span><br/>
            <span class="kw">WHERE</span> <span class="col">condition</span>;
          </div>

          <div class="code-label">Examples</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- students older than 20</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">age</span> <span class="op">&gt;</span> <span class="num">20</span>;<br/><br/>
            <span class="cmt">-- find a specific student</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">name</span> <span class="op">=</span> <span class="str">'Alice'</span>;<br/><br/>
            <span class="cmt">-- multiple conditions</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">age</span> <span class="op">&gt;</span> <span class="num">20</span> <span class="kw">AND</span> <span class="col">gpa</span> <span class="op">&gt;=</span> <span class="num">3.70</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:18px;">
          <div class="card" style="padding:24px 28px;">
            <div class="card-title" style="font-size:26px;margin-bottom:14px;">Comparison Operators</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">=</span> equal to</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-red">!=</span> not equal</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&gt;</span> greater than</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&lt;</span> less than</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&gt;=</span> ≥</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&lt;=</span> ≤</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-green">AND</span> both true</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-yellow">OR</span> either true</div>
            </div>
          </div>

          <div>
            <div class="result-label">WHERE age &gt; 20</div>
            <table class="result-table" style="font-size:25px;">
              <thead><tr><th>id</th><th>name</th><th>age</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>2</td><td>Bob</td><td>22</td><td>3.50</td></tr>
                <tr><td>3</td><td>Carol</td><td>21</td><td>3.90</td></tr>
              </tbody>
            </table>
          </div>

          <div class="highlight-box" style="font-size:25px;">
            💡 Use <code>LIKE '%term%'</code> to search text — e.g. <code>WHERE name LIKE 'A%'</code> finds all names starting with A.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"09 ORDER BY",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Sorting</div>
      <div class="slide-title">Sorting with ORDER BY</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">SELECT</span> <span class="col">columns</span><br/>
            <span class="kw">FROM</span> <span class="tbl">table</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">column</span> <span class="op">ASC</span>|<span class="op">DESC</span>;
          </div>

          <div class="code-label">Examples</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- highest GPA first</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">gpa</span> <span class="op">DESC</span>;<br/><br/>
            <span class="cmt">-- alphabetical by name</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">name</span> <span class="op">ASC</span>;<br/><br/>
            <span class="cmt">-- combined with WHERE + LIMIT</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">age</span> <span class="op">&gt;</span> <span class="num">20</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">gpa</span> <span class="op">DESC</span> <span class="kw">LIMIT</span> <span class="num">10</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:18px;">
          <div class="col2" style="gap:16px;">
            <div style="border-radius:14px;background:#EFF6FF;border:1.5px solid #BFDBFE;padding:22px 16px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--blue2);margin-bottom:8px;text-align:center;">ASC</div>
              <div style="font-size:24px;color:var(--navy);opacity:.7;margin-bottom:14px;text-align:center;">Ascending (default)<br/>smallest → largest</div>
              <div style="background:#dbeafe;border-radius:8px;padding:12px 16px;font-family:var(--mono);font-size:24px;color:var(--blue2);">
                1 &nbsp;→&nbsp; 2 &nbsp;→&nbsp; 3<br/>
                A &nbsp;→&nbsp; B &nbsp;→&nbsp; C
              </div>
            </div>
            <div style="border-radius:14px;background:#ECFDF5;border:1.5px solid #6EE7B7;padding:22px 16px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#059669;margin-bottom:8px;text-align:center;">DESC</div>
              <div style="font-size:24px;color:var(--navy);opacity:.7;margin-bottom:14px;text-align:center;">Descending<br/>largest → smallest</div>
              <div style="background:#d1fae5;border-radius:8px;padding:12px 16px;font-family:var(--mono);font-size:24px;color:#059669;">
                3 &nbsp;→&nbsp; 2 &nbsp;→&nbsp; 1<br/>
                C &nbsp;→&nbsp; B &nbsp;→&nbsp; A
              </div>
            </div>
          </div>

          <div>
            <div class="result-label">ORDER BY gpa DESC</div>
            <table class="result-table" style="font-size:25px;">
              <thead><tr><th>#</th><th>name</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>1st</td><td>Carol</td><td style="color:#059669;font-weight:700;">3.90</td></tr>
                <tr><td>2nd</td><td>Alice</td><td>3.80</td></tr>
                <tr><td>3rd</td><td>Bob</td><td style="color:#DC2626;">3.50</td></tr>
              </tbody>
            </table>
          </div>

          <div class="highlight-box green" style="font-size:25px;">
            💡 Add <code>LIMIT 10</code> at the end to get only the top N results — great for leaderboards!
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"dark",label:"10 UPDATE",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Command 4 of 5</div>
      <div class="slide-title" style="color:#fff;">Updating Records</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label" style="color:rgba(255,255,255,.4);">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">UPDATE</span> <span class="tbl">table</span><br/>
            <span class="kw">SET</span> <span class="col">column1</span> <span class="op">=</span> <span class="str">new_value</span><br/>
            <span class="kw">WHERE</span> <span class="col">condition</span>;
          </div>

          <div class="code-label" style="color:rgba(255,255,255,.4);">Examples</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- Bob got a better grade!</span><br/>
            <span class="kw">UPDATE</span> <span class="tbl">students</span><br/>
            <span class="kw">SET</span> <span class="col">gpa</span> <span class="op">=</span> <span class="num">3.75</span><br/>
            <span class="kw">WHERE</span> <span class="col">id</span> <span class="op">=</span> <span class="num">2</span>;<br/><br/>
            <span class="cmt">-- Update multiple columns</span><br/>
            <span class="kw">UPDATE</span> <span class="tbl">students</span><br/>
            <span class="kw">SET</span> <span class="col">age</span> <span class="op">=</span> <span class="num">23</span>, <span class="col">email</span> <span class="op">=</span> <span class="str">'bob.new@uni.edu'</span><br/>
            <span class="kw">WHERE</span> <span class="col">id</span> <span class="op">=</span> <span class="num">2</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:22px;">
          <!-- before / after visual -->
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div>
              <div style="font-size:24px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Before UPDATE</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:rgba(255,255,255,.08);">
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">id</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">name</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">gpa</th>
                </tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:9px 16px;">1</td><td style="padding:9px 16px;">Alice</td><td style="padding:9px 16px;">3.80</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#F87171;background:rgba(248,113,113,.08);"><td style="padding:9px 16px;">2</td><td style="padding:9px 16px;">Bob</td><td style="padding:9px 16px;">3.50 ←</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:9px 16px;">3</td><td style="padding:9px 16px;">Carol</td><td style="padding:9px 16px;">3.90</td></tr>
                </tbody>
              </table>
            </div>

            <div style="display:flex;justify-content:center;font-size:36px;">↓</div>

            <div>
              <div style="font-size:24px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">After UPDATE</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:rgba(255,255,255,.08);">
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">id</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">name</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">gpa</th>
                </tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:9px 16px;">1</td><td style="padding:9px 16px;">Alice</td><td style="padding:9px 16px;">3.80</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#34D399;background:rgba(52,211,153,.08);"><td style="padding:9px 16px;">2</td><td style="padding:9px 16px;">Bob</td><td style="padding:9px 16px;">3.75 ✓</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:9px 16px;">3</td><td style="padding:9px 16px;">Carol</td><td style="padding:9px 16px;">3.90</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="highlight-box" style="border-color:var(--red);background:rgba(248,113,113,.1);color:rgba(255,255,255,.85);font-size:26px;">
            ⚠️ <strong style="color:var(--red);">Always use WHERE!</strong> Without it, every row gets updated — a common mistake!
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"11 DELETE",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Command 5 of 5</div>
      <div class="slide-title">Deleting Records</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">DELETE FROM</span> <span class="tbl">table</span><br/>
            <span class="kw">WHERE</span> <span class="col">condition</span>;
          </div>

          <div class="code-label">Example</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- remove one student</span><br/>
            <span class="kw">DELETE FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">id</span> <span class="op">=</span> <span class="num">2</span>;<br/><br/>
            <span class="cmt">-- remove low-GPA records</span><br/>
            <span class="kw">DELETE FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">gpa</span> <span class="op">&lt;</span> <span class="num">3.60</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:24px;">
          <div>
            <div class="result-label">Before DELETE WHERE id = 2</div>
            <table class="result-table">
              <thead><tr><th>id</th><th>name</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>3.80</td></tr>
                <tr style="background:#FEE2E2 !important;"><td><s style="color:#DC2626;">2</s></td><td><s style="color:#DC2626;">Bob</s></td><td><s style="color:#DC2626;">3.75</s></td></tr>
                <tr><td>3</td><td>Carol</td><td>3.90</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div class="result-label" style="color:var(--blue);">After DELETE</div>
            <table class="result-table">
              <thead><tr><th>id</th><th>name</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>3.80</td></tr>
                <tr><td>3</td><td>Carol</td><td>3.90</td></tr>
              </tbody>
            </table>
          </div>

          <div style="background:#FEF3C7;border:1.5px solid #FCD34D;border-radius:14px;padding:24px 28px;">
            <div style="font-size:26px;font-weight:700;color:#D97706;margin-bottom:12px;">⚠️ DELETE vs TRUNCATE</div>
            <div style="font-size:25px;line-height:1.5;">
              <code>DELETE FROM t WHERE …</code> — removes specific rows<br/>
              <code>DELETE FROM t</code> — removes all rows (slow)<br/>
              <code>TRUNCATE TABLE t</code> — wipes all rows instantly, resets IDs
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"12 Aggregate Functions",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:45px 110px 0;padding-bottom:88px">
      <div class="tag">Going Further</div>
      <div class="slide-title">Aggregate Functions</div>
      <div class="body-text" style="opacity:.6;margin-top:12px;">Perform calculations <strong>across many rows</strong> and return a single result.</div>

      <div class="col2" style="flex:1;align-items:start;margin-top:16px;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-block" style="font-size:27px;">
            <span class="cmt">-- count all students</span><br/>
            <span class="kw">SELECT</span> <span class="fn">COUNT</span>(*) <span class="kw">FROM</span> <span class="tbl">students</span>;<br/><br/>
            <span class="cmt">-- average GPA</span><br/>
            <span class="kw">SELECT</span> <span class="fn">AVG</span>(<span class="col">gpa</span>) <span class="kw">FROM</span> <span class="tbl">students</span>;<br/><br/>
            <span class="cmt">-- highest and lowest GPA</span><br/>
            <span class="kw">SELECT</span> <span class="fn">MAX</span>(<span class="col">gpa</span>), <span class="fn">MIN</span>(<span class="col">gpa</span>)<br/>
            <span class="kw">FROM</span> <span class="tbl">students</span>;<br/><br/>
            <span class="cmt">-- group by + count</span><br/>
            <span class="kw">SELECT</span> <span class="col">age</span>, <span class="fn">COUNT</span>(*) <span class="kw">AS</span> <span class="str">total</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">GROUP BY</span> <span class="col">age</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- function cards grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div style="border-radius:14px;background:#EFF6FF;border:1.5px solid #BFDBFE;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--blue2);">COUNT()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Counts number of rows</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:var(--blue2);">→ 3</div>
            </div>
            <div style="border-radius:14px;background:#ECFDF5;border:1.5px solid #6EE7B7;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#059669;">AVG()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Average of a column</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:#059669;">→ 3.83</div>
            </div>
            <div style="border-radius:14px;background:#FEF3C7;border:1.5px solid #FCD34D;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#D97706;">MAX()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Highest value</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:#D97706;">→ 3.90</div>
            </div>
            <div style="border-radius:14px;background:#FEE2E2;border:1.5px solid #FCA5A5;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#DC2626;">MIN()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Lowest value</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:#DC2626;">→ 3.50</div>
            </div>
          </div>

          <div>
            <div class="result-label">GROUP BY age result</div>
            <table class="result-table">
              <thead><tr><th>age</th><th>total</th></tr></thead>
              <tbody>
                <tr><td>20</td><td>1</td></tr>
                <tr><td>21</td><td>1</td></tr>
                <tr><td>22</td><td>1</td></tr>
              </tbody>
            </table>
          </div>

          <div style="border-left:4px solid var(--blue);padding:12px 18px;background:rgba(74,142,245,.07);border-radius:0 8px 8px 0;font-size:25px;line-height:1.4;">
            💡 <code>GROUP BY</code> groups rows so functions run <em>per group</em>.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"dark",label:"13 Joining Tables",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:45px 110px 0;padding-bottom:88px;">
      <div class="tag">Relationships</div>
      <div class="slide-title" style="color:#fff;">Joining Tables</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- Two tables visual -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <div style="font-size:24px;color:rgba(255,255,255,.4);font-family:var(--mono);font-weight:600;text-transform:uppercase;margin-bottom:8px;">students</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:var(--blue2);color:#fff;">
                  <th style="padding:8px 12px;text-align:left;">id</th>
                  <th style="padding:8px 12px;text-align:left;">name</th>
                </tr></thead>
                <tbody style="background:#0f1117;">
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">1</td><td style="padding:7px 12px;">Alice</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">2</td><td style="padding:7px 12px;">Bob</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:7px 12px;">3</td><td style="padding:7px 12px;">Carol</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <div style="font-size:24px;color:rgba(255,255,255,.4);font-family:var(--mono);font-weight:600;text-transform:uppercase;margin-bottom:8px;">grades</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:#059669;color:#fff;">
                  <th style="padding:8px 12px;text-align:left;">student_id</th>
                  <th style="padding:8px 12px;text-align:left;">score</th>
                </tr></thead>
                <tbody style="background:#0f1117;">
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">1</td><td style="padding:7px 12px;">88</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">2</td><td style="padding:7px 12px;">75</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:7px 12px;">3</td><td style="padding:7px 12px;">95</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="display:flex;justify-content:center;align-items:center;gap:16px;font-size:26px;color:rgba(255,255,255,.4);font-family:var(--mono);font-weight:600;">
            <div style="width:120px;height:120px;border-radius:50%;background:rgba(74,142,245,.25);border:2px solid var(--blue);display:flex;align-items:center;justify-content:center;font-size:24px;">students</div>
            <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.3);margin:0 -20px;display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--navy2);font-weight:700;">JOIN</div>
            <div style="width:120px;height:120px;border-radius:50%;background:rgba(5,150,105,.25);border:2px solid #34D399;display:flex;align-items:center;justify-content:center;font-size:24px;">grades</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-label" style="color:rgba(255,255,255,.4);">INNER JOIN query</div>
          <div class="code-block" style="font-size:27px;">
            <span class="kw">SELECT</span><br/>
            &nbsp;&nbsp;<span class="tbl">s</span>.<span class="col">name</span>,<br/>
            &nbsp;&nbsp;<span class="tbl">g</span>.<span class="col">score</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span> <span class="kw">AS</span> <span class="tbl">s</span><br/>
            <span class="kw">INNER JOIN</span> <span class="tbl">grades</span> <span class="kw">AS</span> <span class="tbl">g</span><br/>
            &nbsp;&nbsp;<span class="kw">ON</span> <span class="tbl">s</span>.<span class="col">id</span> <span class="op">=</span> <span class="tbl">g</span>.<span class="col">student_id</span>;
          </div>

          <div class="result-label">Combined result</div>
          <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:26px;">
            <thead><tr style="background:linear-gradient(90deg, var(--blue2) 50%, #059669 50%);color:#fff;">
              <th style="padding:10px 16px;text-align:left;background:var(--blue2);">name</th>
              <th style="padding:10px 16px;text-align:left;background:#059669;">score</th>
            </tr></thead>
            <tbody style="background:#0f1117;">
              <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:10px 16px;">Alice</td><td style="padding:10px 16px;">88</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:10px 16px;">Bob</td><td style="padding:10px 16px;">75</td></tr>
              <tr style="color:#CDD6F4;"><td style="padding:10px 16px;">Carol</td><td style="padding:10px 16px;">95</td></tr>
            </tbody>
          </table>

          <div style="border-left:4px solid var(--blue);padding:12px 18px;background:rgba(74,142,245,.08);border-radius:0 8px 8px 0;color:rgba(255,255,255,.8);font-size:25px;line-height:1.4;">
            <strong style="color:var(--blue);">INNER JOIN</strong> returns only matching rows from <em>both</em> tables.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`},{classes:"",label:"14 Summary",html:`<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:45px 110px 0;padding-bottom:88px;" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Quick Reference</div>
      <div class="slide-title">Summary &amp; Quick Reference</div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;flex:1;margin-top:28px;">
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#89B4FA;">CREATE</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Make a new database or table</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">CREATE TABLE t (…);</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#A6E3A1;">INSERT</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Add rows to a table</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">INSERT INTO t (…) VALUES (…);</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#89DCEB;">SELECT</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Read / query data</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">SELECT * FROM t WHERE …;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#FAB387;">UPDATE</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Modify existing rows</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">UPDATE t SET col=v WHERE …;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#F38BA8;">DELETE</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Remove rows</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">DELETE FROM t WHERE …;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#CBA6F7;">ORDER BY</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Sort results</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">ORDER BY col ASC|DESC;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#94E2D5;">Aggregates</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Calculate across rows</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">COUNT · AVG · MAX · MIN · SUM</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#F9E2AF;">JOIN</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Combine multiple tables</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">INNER JOIN t ON a.id=b.id;</div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>`}];function cs(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),A=a.useRef(null),N=a.useRef(null),[z,M]=a.useState(.5),[S,D]=a.useState({x:0,y:0});a.useEffect(()=>{const l="sql-deck-styles";if(!document.getElementById(l)){const c=document.createElement("style");c.id=l,c.textContent=ds,document.head.appendChild(c)}return()=>{document.getElementById("sql-deck-styles")?.remove()}},[]),a.useEffect(()=>{const l=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",l),()=>document.removeEventListener("fullscreenchange",l)},[]),a.useEffect(()=>{const l=N.current;if(!l)return;const c=()=>{const v=l.offsetWidth,E=l.offsetHeight;if(s&&E>0){const R=Math.min(v/1920,E/1080);M(R),D({x:(v-1920*R)/2,y:(E-1080*R)/2})}else M(v/1920),D({x:0,y:0})},b=new ResizeObserver(c);return b.observe(l),c(),()=>b.disconnect()},[s]);const f=()=>{document.fullscreenElement?document.exitFullscreen():A.current?.requestFullscreen()};a.useEffect(()=>{const l=c=>{const b=c.target?.tagName;b==="INPUT"||b==="TEXTAREA"||(c.key==="ArrowRight"&&r(v=>Math.min(v+1,Ee.length-1)),c.key==="ArrowLeft"&&r(v=>Math.max(v-1,0)))};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[]);const g=Ee[t],d=Ee.length;return e.jsxs("div",{ref:A,style:{background:"#0f1117",borderRadius:s?0:16,overflow:"hidden",border:s?"none":"1.5px solid rgba(74,142,245,0.2)",boxShadow:s?"none":"0 8px 32px rgba(0,0,0,0.25)",...s?{display:"flex",flexDirection:"column",height:"100%"}:{}},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#F87171"}}),e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#FBBF24"}}),e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#34D399"}}),e.jsxs("span",{style:{marginLeft:10,fontFamily:"JetBrains Mono, monospace",fontSize:12,color:"rgba(255,255,255,0.35)",letterSpacing:"0.06em"},children:["MBI802 · SQL Deck · ",t+1," / ",d," · ← → to navigate"]})]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[!s&&e.jsxs("button",{onClick:()=>h(l=>!l),style:{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,padding:"4px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11},children:[o?e.jsx(ie,{size:13}):e.jsx(ae,{size:13}),o?"Collapse":"Expand"]}),e.jsxs("button",{onClick:f,style:{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,padding:"4px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11},title:s?"Exit fullscreen":"Fullscreen",children:[s?e.jsx(oe,{size:13}):e.jsx(re,{size:13}),s?"Exit":"Fullscreen"]})]})]}),e.jsx("div",{ref:N,style:{position:"relative",width:"100%",...s?{flex:1}:{paddingBottom:o?"75%":"56.25%",transition:"padding-bottom 0.3s ease"},overflow:"hidden",background:"#0f1117"},children:e.jsx("div",{style:{position:"absolute",inset:0,overflow:"hidden"},children:e.jsx("div",{className:"sqld",style:{width:1920,height:1080,transform:`translate(${S.x}px, ${S.y}px) scale(${z})`,transformOrigin:"top left",position:"relative"},children:e.jsx("section",{className:g.classes||void 0,style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"flex",flexDirection:"column"},dangerouslySetInnerHTML:{__html:g.html}})})})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:16,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0},children:[e.jsxs("button",{onClick:()=>r(l=>Math.max(l-1,0)),disabled:t===0,style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 14px",color:t===0?"rgba(255,255,255,0.2)":"#fff",cursor:t===0?"default":"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13},children:[e.jsx(le,{size:14})," Prev"]}),e.jsx("div",{style:{display:"flex",gap:5,alignItems:"center"},children:Ee.map((l,c)=>e.jsx("button",{onClick:()=>r(c),title:Ee[c].label,style:{width:c===t?22:8,height:8,borderRadius:999,background:c===t?"#4A8EF5":"rgba(255,255,255,0.2)",border:"none",padding:0,cursor:"pointer",transition:"all 0.25s ease",flexShrink:0}},c))}),e.jsxs("button",{onClick:()=>r(l=>Math.min(l+1,d-1)),disabled:t===d-1,style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 14px",color:t===d-1?"rgba(255,255,255,0.2)":"#fff",cursor:t===d-1?"default":"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13},children:["Next ",e.jsx(X,{size:14})]})]})]})}const ps=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

* {box-sizing:border-box;margin:0;padding:0}
.erd section {background:#FAF9F6;color:#1a2744;overflow:hidden;position:relative}
.erd .inner {position:absolute;inset:0;display:flex;flex-direction:column;padding:78px 108px 68px}
.erd .inner.center {align-items:center;justify-content:center;text-align:center}
.erd .kicker {font-size:24px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#0d7a72;margin-bottom:14px}
.erd .stitle {font-size:58px;font-weight:700;line-height:1.1}
.erd .body {font-size:31px;line-height:1.6}
.erd .small {font-size:25px;line-height:1.55}
.erd .cap {font-size:19px;color:#9ca3af;font-style:italic;text-align:center;margin-top:8px}
.erd .dark {background:#1a2744!important;color:#FAF9F6!important}
.erd .navy2 {background:#1e3a6e!important;color:#FAF9F6!important}
.erd .dark .kicker, .erd .navy2 .kicker {color:#5eead4}
.erd .bar {width:60px;height:6px;border-radius:3px;background:#0d7a72;margin-bottom:32px}
.erd .bar-amber {background:#c47c1a}
.erd .two {display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start}
.erd .three {display:grid;grid-template-columns:1fr 1fr 1fr;gap:36px;align-items:start}
.erd .card {background:white;border-radius:14px;padding:32px 38px;box-shadow:0 2px 16px rgba(0,0,0,.07)}
.erd .card-t {background:#e6f4f3;border-left:5px solid #0d7a72;border-radius:10px;padding:28px 34px}
.erd .card-a {background:#fdf4e3;border-left:5px solid #c47c1a;border-radius:10px;padding:28px 34px}
.erd ul.clean {list-style:none}
.erd ul.clean li {display:flex;align-items:flex-start;gap:14px;font-size:29px;line-height:1.5;margin-bottom:20px}
.erd ul.clean li::before {content:'';display:block;width:9px;height:9px;border-radius:50%;background:#0d7a72;flex-shrink:0;margin-top:11px}
.erd .cr {position:absolute;bottom:26px;left:0;right:0;text-align:center;font-size:24px;color:#9ca3af;z-index:2}
.erd .dark .cr, .erd .navy2 .cr {color:rgba(255,255,255,.28)}
.erd .sec-num {font-size:200px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;position:absolute;right:80px;bottom:50px;z-index:0;pointer-events:none}
.erd svg text {font-family:'DM Sans',sans-serif}
.erd .shape-row {display:flex;align-items:center;gap:24px;margin-bottom:18px}
.erd .shape-label {font-size:26px;font-weight:700;min-width:200px}
.erd .shape-desc {font-size:22px;color:#374151;line-height:1.4}
.erd .pill {display:inline-block;padding:4px 16px;border-radius:100px;font-size:20px;font-weight:600}
.erd .step {display:flex;gap:20px;align-items:flex-start;margin-bottom:24px}
.erd .snum {width:48px;height:48px;border-radius:50%;background:#1a2744;color:white;font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.erd .sbody {font-size:27px;line-height:1.5;padding-top:8px}`,De=[{classes:"dark",label:"01 Title",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.04" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
<div style="position:absolute;bottom:60px;right:60px;font-size:260px;font-weight:700;color:rgba(255,255,255,.04);line-height:1;user-select:none">ER</div>
<div class="inner center">
  <div class="kicker" style="margin-bottom:28px">Database Management Systems</div>
  <h1 style="font-size:84px;font-weight:700;line-height:1.05;color:white;margin-bottom:28px">Entity-Relationship<br><span style="color:#5eead4">Diagrams</span></h1>
  <div style="width:80px;height:6px;border-radius:3px;background:#c47c1a;margin:0 auto 32px"></div>
  <p style="font-size:30px;color:rgba(255,255,255,.55);max-width:640px;line-height:1.6">A visual language for designing databases — from idea to blueprint</p>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"02 Agenda",html:`<div class="inner">
  <div class="kicker">Lesson Plan</div>
  <div class="stitle" style="margin-bottom:44px">What We'll Cover</div>
  <div style="display:flex;flex-direction:column;gap:18px;max-width:880px">
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#1a2744;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">1</div><div class="body">What is an ER diagram &amp; why do we use it?</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#1a2744;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">2</div><div class="body">Two notations — Chen's vs. Crow's Foot</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#0d7a72;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">3</div><div class="body">Chen's shapes — entity, attribute, key attribute, relationship</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#0d7a72;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">4</div><div class="body">Cardinality — 1:1, 1:N, M:N</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#c47c1a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">5</div><div class="body">Drawing a complete ER diagram — step by step</div></div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"navy2",label:"03 Sec What Why",html:`<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">01</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">What &amp; Why ER Diagrams?</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:640px;line-height:1.6">Before we draw shapes — let's understand the purpose</p>
</div>
<div class="sec-num">01</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"04 What Is ER",html:`<div class="inner">
  <div class="kicker">Section 01</div>
  <div class="stitle" style="margin-bottom:40px">What Is an ER Diagram?</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean" style="padding:0">
        <li style="margin-bottom:20px"><span style="display:block;text-wrap:pretty">A <strong>blueprint</strong> for a database drawn <em>before</em> any code is written</span></li>
        <li style="margin-bottom:20px"><span style="display:block;text-wrap:pretty">Shows real-world <strong>things</strong>, their <strong>properties</strong>, and how they <strong>connect</strong></span></li>
        <li style="margin-bottom:20px"><span style="display:block;text-wrap:pretty">Invented by <strong>Peter Chen in 1976</strong></span></li>
        <li><span style="display:block;text-wrap:pretty">Language-neutral — any team can read it</span></li>
      </ul>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card" style="display:flex;align-items:center;gap:20px">
        <div style="font-size:48px">🏗️</div>
        <div><div style="font-size:24px;font-weight:700;margin-bottom:4px">Architect's Blueprint</div><div class="small" style="color:#6b7280">Plans rooms before building a house</div></div>
      </div>
      <div style="text-align:center;font-size:32px;color:#9ca3af">≈</div>
      <div class="card" style="display:flex;align-items:center;gap:20px;border-left:5px solid #0d7a72">
        <div style="font-size:48px">🗂️</div>
        <div><div style="font-size:24px;font-weight:700;margin-bottom:4px">ER Diagram</div><div class="small" style="color:#6b7280">Plans tables before coding a database</div></div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"05 Why ER",html:`<div class="inner" style="padding-top:60px">
  <div class="kicker">Section 01</div>
  <div class="stitle" style="margin-bottom:36px">Why Do We Need Them?</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;flex:1">

    <!-- Card 1: Common Language -->
    <div style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);display:flex;flex-direction:column">
      <div style="background:linear-gradient(135deg,#0d7a72,#14b8a6);padding:36px 32px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.15)"/>
          <rect x="12" y="20" width="20" height="15" rx="3" fill="white" opacity=".9"/>
          <rect x="32" y="26" width="20" height="15" rx="3" fill="white" opacity=".9"/>
          <rect x="22" y="34" width="20" height="15" rx="3" fill="white" opacity=".6"/>
          <circle cx="20" cy="46" r="3" fill="white" opacity=".9"/>
          <circle cx="32" cy="46" r="3" fill="white" opacity=".9"/>
          <circle cx="44" cy="46" r="3" fill="white" opacity=".9"/>
        </svg>
        <div style="font-size:26px;font-weight:700;color:white;line-height:1.2">Common Language</div>
      </div>
      <div style="padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:16px">
        <div style="font-size:25px;color:#374151;line-height:1.55">One diagram everyone understands — developers, managers, and clients — no technical jargon needed.</div>
        <div style="margin-top:auto;display:flex;gap:10px;flex-wrap:wrap">
          <span style="background:#e6f4f3;color:#0d7a72;border-radius:100px;padding:4px 14px;font-size:21px;font-weight:600">Developers</span>
          <span style="background:#e6f4f3;color:#0d7a72;border-radius:100px;padding:4px 14px;font-size:21px;font-weight:600">Managers</span>
          <span style="background:#e6f4f3;color:#0d7a72;border-radius:100px;padding:4px 14px;font-size:21px;font-weight:600">Clients</span>
        </div>
      </div>
    </div>

    <!-- Card 2: Catch Errors Early -->
    <div style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);display:flex;flex-direction:column">
      <div style="background:linear-gradient(135deg,#c47c1a,#f59e0b);padding:36px 32px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.15)"/>
          <!-- paper/diagram -->  
          <rect x="14" y="12" width="28" height="36" rx="3" fill="white" opacity=".9"/>
          <line x1="19" y1="20" x2="36" y2="20" stroke="rgba(196,124,26,.6)" stroke-width="2"/>
          <line x1="19" y1="26" x2="36" y2="26" stroke="rgba(196,124,26,.6)" stroke-width="2"/>
          <line x1="19" y1="32" x2="30" y2="32" stroke="rgba(196,124,26,.6)" stroke-width="2"/>
          <!-- magnify -->  
          <circle cx="42" cy="42" r="10" stroke="white" stroke-width="2.5" fill="none"/>
          <line x1="49" y1="49" x2="55" y2="55" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <text x="38" y="47" font-size="10" fill="white" font-weight="700">!</text>
        </svg>
        <div style="font-size:26px;font-weight:700;color:white;line-height:1.2">Catch Errors Early</div>
      </div>
      <div style="padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:16px">
        <div style="font-size:25px;color:#374151;line-height:1.55">Fixing a design mistake on paper takes minutes. Fixing the same mistake in a live database can take days.</div>
        <div style="margin-top:auto;display:flex;align-items:center;gap:16px;background:#fdf4e3;border-radius:10px;padding:14px 18px">
          <div style="text-align:center">
            <div style="font-size:26px;font-weight:700;color:#c47c1a">Paper</div>
            <div style="font-size:22px;color:#6b7280">minutes</div>
          </div>
          <div style="font-size:28px;color:#9ca3af;font-weight:300">vs</div>
          <div style="text-align:center">
            <div style="font-size:26px;font-weight:700;color:#991b1b">Live DB</div>
            <div style="font-size:22px;color:#6b7280">days</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 3: Road Map to Tables -->
    <div style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);display:flex;flex-direction:column">
      <div style="background:linear-gradient(135deg,#5b21b6,#7c3aed);padding:36px 32px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.15)"/>
          <!-- ER box --> 
          <rect x="8" y="20" width="18" height="12" rx="2" fill="white" opacity=".9"/>
          <!-- arrow -->
          <line x1="26" y1="26" x2="36" y2="26" stroke="white" stroke-width="2" opacity=".8"/>
          <polygon points="36,22 42,26 36,30" fill="white" opacity=".8"/>
          <!-- DB table -->
          <rect x="42" y="14" width="16" height="24" rx="2" fill="white" opacity=".9"/>
          <line x1="42" y1="20" x2="58" y2="20" stroke="rgba(91,33,182,.4)" stroke-width="1.5"/>
          <line x1="42" y1="26" x2="58" y2="26" stroke="rgba(91,33,182,.4)" stroke-width="1.5"/>
          <line x1="42" y1="32" x2="58" y2="32" stroke="rgba(91,33,182,.4)" stroke-width="1.5"/>
          <!-- labels -->
          <text x="12" y="46" font-size="8" fill="white" opacity=".8">Entity</text>
          <text x="42" y="46" font-size="8" fill="white" opacity=".8">Table</text>
        </svg>
        <div style="font-size:26px;font-weight:700;color:white;line-height:1.2">Road Map to Tables</div>
      </div>
      <div style="padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:14px">
        <div style="font-size:25px;color:#374151;line-height:1.55">Each shape maps directly to a database structure — no guesswork when building.</div>
        <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:10px;font-size:22px">
            <span style="background:#ede9fe;color:#5b21b6;border-radius:6px;padding:3px 10px;font-weight:600">Entity</span>
            <span style="color:#9ca3af">→</span>
            <span style="color:#374151;font-weight:600">Table</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:22px">
            <span style="background:#ede9fe;color:#5b21b6;border-radius:6px;padding:3px 10px;font-weight:600">Attribute</span>
            <span style="color:#9ca3af">→</span>
            <span style="color:#374151;font-weight:600">Column</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:22px">
            <span style="background:#ede9fe;color:#5b21b6;border-radius:6px;padding:3px 10px;font-weight:600">Key Attr</span>
            <span style="color:#9ca3af">→</span>
            <span style="color:#374151;font-weight:600">Primary Key</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"navy2",label:"06 Sec Notations",html:`<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">02</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Two Popular Notations</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:640px;line-height:1.6">Same concept — different visual style</p>
</div>
<div class="sec-num">02</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"07 Notations Compare",html:`<div class="inner">
  <div class="kicker">Section 02</div>
  <div class="stitle" style="margin-bottom:40px">Chen's vs. Crow's Foot Notation</div>
  <div class="two" style="gap:44px;align-items:stretch">
    <!-- CHEN -->
    <div class="card" style="border-top:6px solid #0d7a72;display:flex;flex-direction:column;align-items:center;gap:16px">
      <div style="font-size:28px;font-weight:700;color:#0d7a72">Chen's Notation (1976)</div>
      <p class="small" style="text-align:center;color:#374151">Uses <strong>geometric shapes</strong> — rectangles, diamonds &amp; ellipses</p>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <rect x="10" y="55" width="110" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="65" y="84" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <line x1="120" y1="79" x2="144" y2="79" stroke="#374151" stroke-width="2"/>
        <polygon points="178,54 222,79 178,104 134,79" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="178" y="84" font-size="13" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
        <line x1="222" y1="79" x2="244" y2="79" stroke="#374151" stroke-width="2"/>
        <rect x="244" y="55" width="88" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="288" y="84" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <ellipse cx="65" cy="22" rx="40" ry="18" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="65" y="27" font-size="13" fill="#064e3b" text-anchor="middle">Name</text>
        <line x1="65" y1="40" x2="65" y2="55" stroke="#374151" stroke-width="1.5"/>
        <text x="126" y="70" font-size="17" font-weight="700" fill="#1d4ed8">M</text>
        <text x="226" y="70" font-size="17" font-weight="700" fill="#1d4ed8">N</text>
      </svg>
      <div class="small" style="text-align:center;color:#374151">Classic academic notation · Easy to learn</div>
      <div style="display:inline-block;background:#0d7a72;color:white;border-radius:100px;padding:6px 20px;font-size:19px;font-weight:600">✅ Used in MBI802</div>
    </div>
    <!-- CROW'S FOOT -->
    <div class="card" style="border-top:6px solid #6b7280;display:flex;flex-direction:column;align-items:center;gap:16px">
      <div style="font-size:28px;font-weight:700;color:#374151">Crow's Foot Notation</div>
      <p class="small" style="text-align:center;color:#374151">Uses <strong>line-end symbols</strong> on connecting lines to show cardinality</p>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <rect x="10" y="45" width="120" height="72" rx="0" fill="white" stroke="#374151" stroke-width="2.5"/>
        <rect x="10" y="45" width="120" height="26" fill="#374151"/>
        <text x="70" y="64" font-size="14" font-weight="700" fill="white" text-anchor="middle">STUDENT</text>
        <text x="70" y="94" font-size="12" fill="#374151" text-anchor="middle">StudentID (PK)</text>
        <text x="70" y="110" font-size="12" fill="#374151" text-anchor="middle">Name</text>
        <rect x="210" y="45" width="120" height="72" rx="0" fill="white" stroke="#374151" stroke-width="2.5"/>
        <rect x="210" y="45" width="120" height="26" fill="#374151"/>
        <text x="270" y="64" font-size="14" font-weight="700" fill="white" text-anchor="middle">COURSE</text>
        <text x="270" y="94" font-size="12" fill="#374151" text-anchor="middle">CourseID (PK)</text>
        <text x="270" y="110" font-size="12" fill="#374151" text-anchor="middle">Title</text>
        <line x1="130" y1="81" x2="210" y2="81" stroke="#374151" stroke-width="2.5"/>
        <line x1="136" y1="74" x2="136" y2="88" stroke="#374151" stroke-width="2.5"/>
        <line x1="143" y1="74" x2="143" y2="88" stroke="#374151" stroke-width="2.5"/>
        <line x1="204" y1="81" x2="192" y2="71" stroke="#374151" stroke-width="2"/>
        <line x1="204" y1="81" x2="192" y2="81" stroke="#374151" stroke-width="2"/>
        <line x1="204" y1="81" x2="192" y2="91" stroke="#374151" stroke-width="2"/>
        <line x1="197" y1="74" x2="197" y2="88" stroke="#374151" stroke-width="2"/>
      </svg>
      <div class="small" style="text-align:center;color:#374151">Common in industry tools (Lucidchart, Visio, draw.io)</div>
      <div style="display:inline-block;background:#6b7280;color:white;border-radius:100px;padding:6px 20px;font-size:19px;font-weight:600">📌 For reference only</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"navy2",label:"08 Sec Chen Shapes",html:`<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">03</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Chen's Notation — The Shapes</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:660px;line-height:1.6">Four shapes. Each shape has one specific job.</p>
</div>
<div class="sec-num">03</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"09 Entity Shape",html:`<div class="inner">
  <div class="kicker">Chen's Shapes · 1 of 4</div>
  <div class="stitle" style="margin-bottom:36px">Entity — The Rectangle</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>A real-world <strong>"thing"</strong> we want to track</li>
        <li>Always a <strong>noun</strong>: Student, Course, Teacher, Product…</li>
        <li>Each entity will become a <strong>table</strong> in the database</li>
        <li>Written in <strong>UPPERCASE</strong> inside the rectangle</li>
      </ul>
      <div class="card-t" style="margin-top:24px">
        <div class="small"><strong>Test:</strong> Can you list many of them? (Many students, many courses?) → It's an entity.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:24px">
      <svg width="300" height="100" viewBox="0 0 300 100">
        <rect x="10" y="10" width="280" height="80" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
        <text x="150" y="60" font-size="28" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
      </svg>
      <div class="cap">An entity named STUDENT</div>
      <div style="display:flex;gap:18px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <svg width="130" height="64" viewBox="0 0 130 64"><rect x="4" y="4" width="122" height="56" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/><text x="65" y="37" font-size="18" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text></svg>
          <div class="cap">COURSE</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <svg width="130" height="64" viewBox="0 0 130 64"><rect x="4" y="4" width="122" height="56" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/><text x="65" y="37" font-size="18" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text></svg>
          <div class="cap">TEACHER</div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"10 Attribute Shape",html:`<div class="inner">
  <div class="kicker">Chen's Shapes · 2 of 4</div>
  <div class="stitle" style="margin-bottom:32px">Attribute — The Ellipse</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>A <strong>property</strong> of an entity</li>
        <li>Connected to their entity by a line</li>
        <li>STUDENT attributes: <em>Name, Email, BirthDate…</em></li>
        <li>Will become a <strong>column</strong> in the database table</li>
      </ul>
      <div class="card-t" style="margin-top:24px">
        <div class="small"><strong>Rule:</strong> Does it describe a property of an entity? → it's an attribute</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center">
      <svg width="360" height="300" viewBox="0 0 360 300">
        <rect x="110" y="130" width="140" height="54" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="180" y="163" font-size="18" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <ellipse cx="60" cy="52" rx="50" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="60" y="57" font-size="13" fill="#064e3b" text-anchor="middle">StudentID</text>
        <line x1="97" y1="66" x2="128" y2="130" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="180" cy="46" rx="40" ry="20" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="180" y="51" font-size="13" fill="#064e3b" text-anchor="middle">Name</text>
        <line x1="180" y1="66" x2="180" y2="130" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="300" cy="52" rx="48" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="300" y="57" font-size="13" fill="#064e3b" text-anchor="middle">Email</text>
        <line x1="264" y1="66" x2="232" y2="130" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="180" cy="262" rx="52" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="180" y="267" font-size="13" fill="#064e3b" text-anchor="middle">BirthDate</text>
        <line x1="180" y1="240" x2="180" y2="184" stroke="#374151" stroke-width="1.5"/>
      </svg>
      <div class="cap">STUDENT entity with 4 attributes</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"11 Key Attribute",html:`<div class="inner">
  <div class="kicker">Chen's Shapes · 2b — Special Attribute</div>
  <div class="stitle" style="margin-bottom:32px">Key Attribute — Underlined Ellipse</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>A <strong>unique identifier</strong> — no two rows can share the same value</li>
        <li>Drawn as an ellipse with the attribute name <strong>underlined</strong></li>
        <li>Becomes the <strong>Primary Key</strong> of the table</li>
        <li>Every entity must have one</li>
      </ul>
      <div class="card-a" style="margin-top:24px">
        <div class="small">🔑 Two students may share a name — but each must have a unique <strong>StudentID</strong>. Therefore StudentID is the key attribute.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:28px">
      <div style="display:flex;gap:44px;align-items:center">
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <svg width="130" height="54" viewBox="0 0 130 54"><ellipse cx="65" cy="27" rx="58" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/><text x="65" y="32" font-size="15" fill="#064e3b" text-anchor="middle">Name</text></svg>
          <div class="cap">Regular attribute</div>
        </div>
        <div style="font-size:38px;color:#9ca3af">vs</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <svg width="140" height="54" viewBox="0 0 140 54"><ellipse cx="70" cy="27" rx="62" ry="22" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/><text x="70" y="30" font-size="14" font-weight="700" fill="#3b0764" text-anchor="middle">StudentID</text><line x1="28" y1="35" x2="112" y2="35" stroke="#3b0764" stroke-width="1.8"/></svg>
          <div class="cap">Key attribute (underlined)</div>
        </div>
      </div>
      <svg width="300" height="190" viewBox="0 0 300 190">
        <rect x="85" y="100" width="130" height="50" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="150" y="131" font-size="17" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <ellipse cx="68" cy="42" rx="56" ry="22" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
        <text x="68" y="46" font-size="13" font-weight="700" fill="#3b0764" text-anchor="middle">StudentID</text>
        <line x1="22" y1="51" x2="114" y2="51" stroke="#3b0764" stroke-width="1.5"/>
        <line x1="80" y1="64" x2="112" y2="100" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="232" cy="42" rx="50" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="232" y="47" font-size="13" fill="#064e3b" text-anchor="middle">Name</text>
        <line x1="200" y1="62" x2="188" y2="100" stroke="#374151" stroke-width="1.5"/>
      </svg>
      <div class="cap">StudentID is the key; Name is a regular attribute</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"12 Relationship Shape",html:`<div class="inner">
  <div class="kicker">Chen's Shapes · 3 of 4</div>
  <div class="stitle" style="margin-bottom:32px">Relationship — The Diamond</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>Describes <strong>how two entities connect</strong></li>
        <li>Written as a <strong>verb</strong> inside the diamond</li>
        <li>Lines connect the diamond to both entities</li>
        <li>Examples: <em>enrolls, teaches, manages, owns</em></li>
      </ul>
      <div class="card-t" style="margin-top:24px">
        <div class="small"><strong>Memory tip:</strong> Entity = noun · Relationship = verb<br>"STUDENT <em>enrolls</em> COURSE" → diamond says <em>enrolls</em></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:24px">
      <svg width="380" height="120" viewBox="0 0 380 120">
        <rect x="8" y="36" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="65" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <line x1="116" y1="60" x2="138" y2="60" stroke="#374151" stroke-width="2"/>
        <polygon points="175,36 218,60 175,84 132,60" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="65" font-size="13" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
        <line x1="218" y1="60" x2="240" y2="60" stroke="#374151" stroke-width="2"/>
        <rect x="240" y="36" width="100" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="290" y="65" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
      </svg>
      <div class="cap">STUDENT enrolls COURSE</div>
      <svg width="380" height="100" viewBox="0 0 380 100">
        <rect x="8" y="26" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="55" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>
        <line x1="116" y1="50" x2="138" y2="50" stroke="#374151" stroke-width="2"/>
        <polygon points="175,26 218,50 175,74 132,50" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="55" font-size="13" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text>
        <line x1="218" y1="50" x2="240" y2="50" stroke="#374151" stroke-width="2"/>
        <rect x="240" y="26" width="100" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="290" y="55" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
      </svg>
      <div class="cap">TEACHER teaches COURSE</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"13 Shapes Summary",html:`<div class="inner">
  <div class="kicker">Chen's Shapes — Summary</div>
  <div class="stitle" style="margin-bottom:40px">Four Shapes, Four Jobs</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #1e40af">
      <svg width="96" height="56" viewBox="0 0 96 56"><rect x="3" y="4" width="90" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/><text x="48" y="33" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">ENTITY</text></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Rectangle</div><div class="small" style="color:#374151">A real-world thing → becomes a <strong>table</strong></div></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #065f46">
      <svg width="96" height="56" viewBox="0 0 96 56"><ellipse cx="48" cy="28" rx="43" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2.5"/><text x="48" y="33" font-size="13" fill="#064e3b" text-anchor="middle">attribute</text></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Ellipse</div><div class="small" style="color:#374151">A property → becomes a <strong>column</strong></div></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #5b21b6">
      <svg width="96" height="56" viewBox="0 0 96 56"><ellipse cx="48" cy="28" rx="43" ry="22" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/><text x="48" y="31" font-size="12" font-weight="700" fill="#3b0764" text-anchor="middle">keyAttr</text><line x1="14" y1="36" x2="82" y2="36" stroke="#3b0764" stroke-width="1.5"/></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Underlined Ellipse</div><div class="small" style="color:#374151">Unique identifier → <strong>Primary Key</strong></div></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #d97706">
      <svg width="96" height="56" viewBox="0 0 96 56"><polygon points="48,4 90,28 48,52 6,28" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/><text x="48" y="32" font-size="11" font-weight="600" fill="#92400e" text-anchor="middle">relation</text></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Diamond</div><div class="small" style="color:#374151">A verb linking two entities → <strong>relationship</strong></div></div>
    </div>
  </div>
  <div class="card-t" style="margin-top:24px">
    <div class="small">Lines connect everything — attributes to entities, entities to diamonds. <strong>No floating shapes.</strong></div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"navy2",label:"14 Sec Cardinality",html:`<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">04</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Cardinality</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:660px;line-height:1.6">The numbers on relationship lines — how many can relate to how many?</p>
</div>
<div class="sec-num">04</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"15 Cardinality 1-1",html:`<div class="inner">
  <div class="kicker">Cardinality · One-to-One</div>
  <div class="stitle" style="margin-bottom:32px">1 : 1 — Each side has exactly one match</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="body" style="margin-bottom:22px">Each instance on side A relates to <strong>exactly one</strong> on side B, and vice versa.</div>
      <div class="card-t" style="margin-bottom:16px"><div class="small">🧑‍💼 One <strong>Employee</strong> holds one <strong>Passport</strong><br>One <strong>Passport</strong> belongs to one <strong>Employee</strong></div></div>
      <div class="card-a"><div class="small">🏫 One <strong>Principal</strong> leads one <strong>School</strong></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <svg width="380" height="110" viewBox="0 0 380 110">
        <rect x="8" y="32" width="114" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="65" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">EMPLOYEE</text>
        <line x1="122" y1="56" x2="144" y2="56" stroke="#374151" stroke-width="2.5"/>
        <polygon points="178,33 220,56 178,79 136,56" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="178" y="61" font-size="12" font-weight="600" fill="#92400e" text-anchor="middle">holds</text>
        <line x1="220" y1="56" x2="244" y2="56" stroke="#374151" stroke-width="2.5"/>
        <rect x="244" y="32" width="126" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="307" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">PASSPORT</text>
        <text x="128" y="46" font-size="20" font-weight="700" fill="#1d4ed8">1</text>
        <text x="224" y="46" font-size="20" font-weight="700" fill="#1d4ed8">1</text>
      </svg>
      <div class="cap">The "1" and "1" labels mean one-to-one</div>
      <!-- mapping diagram -->
      <svg width="320" height="130" viewBox="0 0 320 130">
        <text x="80" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">EMPLOYEE</text>
        <text x="240" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">PASSPORT</text>
        <rect x="20" y="24" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="43" font-size="13" fill="#1e3a8a" text-anchor="middle">Alice</text>
        <rect x="20" y="60" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="79" font-size="13" fill="#1e3a8a" text-anchor="middle">Bob</text>
        <rect x="20" y="96" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="115" font-size="13" fill="#1e3a8a" text-anchor="middle">Carol</text>
        <rect x="180" y="24" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="43" font-size="13" fill="#064e3b" text-anchor="middle">P-001</text>
        <rect x="180" y="60" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="79" font-size="13" fill="#064e3b" text-anchor="middle">P-002</text>
        <rect x="180" y="96" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="115" font-size="13" fill="#064e3b" text-anchor="middle">P-003</text>
        <line x1="140" y1="38" x2="180" y2="38" stroke="#0d7a72" stroke-width="1.8"/>
        <line x1="140" y1="74" x2="180" y2="74" stroke="#0d7a72" stroke-width="1.8"/>
        <line x1="140" y1="110" x2="180" y2="110" stroke="#0d7a72" stroke-width="1.8"/>
      </svg>
      <div class="cap">Each employee ↔ exactly one passport</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"16 Cardinality 1-N",html:`<div class="inner">
  <div class="kicker">Cardinality · One-to-Many</div>
  <div class="stitle" style="margin-bottom:32px">1 : N — One side, many on the other</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="body" style="margin-bottom:22px">One instance on side A relates to <strong>many</strong> on side B. But each B belongs to <strong>only one</strong> A.</div>
      <div class="card-t" style="margin-bottom:16px"><div class="small">🏫 One <strong>Teacher</strong> teaches many <strong>Courses</strong><br>Each <strong>Course</strong> has only one <strong>Teacher</strong></div></div>
      <div class="card-a"><div class="small">👩‍👧 One <strong>Mother</strong> has many <strong>Children</strong><br>Each <strong>Child</strong> has one <strong>Mother</strong></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <svg width="380" height="110" viewBox="0 0 380 110">
        <rect x="8" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>
        <line x1="116" y1="56" x2="138" y2="56" stroke="#374151" stroke-width="2.5"/>
        <polygon points="175,33 218,56 175,79 132,56" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="61" font-size="12" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text>
        <line x1="218" y1="56" x2="242" y2="56" stroke="#374151" stroke-width="2.5"/>
        <rect x="242" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="296" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <text x="122" y="46" font-size="20" font-weight="700" fill="#1d4ed8">1</text>
        <text x="222" y="46" font-size="20" font-weight="700" fill="#1d4ed8">N</text>
      </svg>
      <div class="cap">"1" on teacher side, "N" on course side</div>
      <svg width="320" height="150" viewBox="0 0 320 150">
        <text x="80" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>
        <text x="240" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <rect x="20" y="24" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="43" font-size="13" fill="#1e3a8a" text-anchor="middle">Dr. Smith</text>
        <rect x="20" y="80" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="99" font-size="13" fill="#1e3a8a" text-anchor="middle">Dr. Lee</text>
        <rect x="180" y="24" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="43" font-size="13" fill="#064e3b" text-anchor="middle">MBI802</text>
        <rect x="180" y="60" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="79" font-size="13" fill="#064e3b" text-anchor="middle">MBI803</text>
        <rect x="180" y="96" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="115" font-size="13" fill="#064e3b" text-anchor="middle">MBI810</text>
        <rect x="180" y="118" width="120" height="28" rx="4" fill="#fef9c3" stroke="#d97706" stroke-width="1.5"/><text x="240" y="137" font-size="13" fill="#92400e" text-anchor="middle">MBI820</text>
        <line x1="140" y1="38" x2="180" y2="38" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="180" y2="74" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="180" y2="110" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="94" x2="180" y2="132" stroke="#c47c1a" stroke-width="1.5"/>
      </svg>
      <div class="cap">Dr. Smith → 3 courses; Dr. Lee → 1 course</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"17 Cardinality M-N",html:`<div class="inner">
  <div class="kicker">Cardinality · Many-to-Many</div>
  <div class="stitle" style="margin-bottom:32px">M : N — Many on both sides</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="body" style="margin-bottom:22px">Many instances on side A relate to many instances on side B, and vice versa.</div>
      <div class="card-t" style="margin-bottom:16px"><div class="small">📚 One <strong>Student</strong> enrolls in many <strong>Courses</strong><br>One <strong>Course</strong> has many <strong>Students</strong></div></div>
      <div class="card-a"><div class="small">🎬 One <strong>Actor</strong> appears in many <strong>Movies</strong><br>One <strong>Movie</strong> has many <strong>Actors</strong></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <svg width="380" height="110" viewBox="0 0 380 110">
        <rect x="8" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <line x1="116" y1="56" x2="138" y2="56" stroke="#374151" stroke-width="2.5"/>
        <polygon points="175,33 218,56 175,79 132,56" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="61" font-size="12" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
        <line x1="218" y1="56" x2="242" y2="56" stroke="#374151" stroke-width="2.5"/>
        <rect x="242" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="296" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <text x="122" y="46" font-size="20" font-weight="700" fill="#1d4ed8">M</text>
        <text x="222" y="46" font-size="20" font-weight="700" fill="#1d4ed8">N</text>
      </svg>
      <div class="cap">"M" and "N" both mean "many"</div>
      <svg width="320" height="150" viewBox="0 0 320 150">
        <text x="80" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <text x="240" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <rect x="20" y="24" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="43" font-size="13" fill="#1e3a8a" text-anchor="middle">Alice</text>
        <rect x="20" y="60" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="79" font-size="13" fill="#1e3a8a" text-anchor="middle">Bob</text>
        <rect x="20" y="96" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="115" font-size="13" fill="#1e3a8a" text-anchor="middle">Carol</text>
        <rect x="180" y="24" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="43" font-size="13" fill="#064e3b" text-anchor="middle">MBI802</text>
        <rect x="180" y="60" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="79" font-size="13" fill="#064e3b" text-anchor="middle">MBI803</text>
        <rect x="180" y="96" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="115" font-size="13" fill="#064e3b" text-anchor="middle">MBI810</text>
        <!-- many-to-many lines -->
        <line x1="140" y1="38" x2="180" y2="38" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="180" y2="74" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="74" x2="180" y2="38" stroke="#c47c1a" stroke-width="1.5"/>
        <line x1="140" y1="74" x2="180" y2="110" stroke="#c47c1a" stroke-width="1.5"/>
        <line x1="140" y1="110" x2="180" y2="74" stroke="#7c3aed" stroke-width="1.5"/>
        <line x1="140" y1="110" x2="180" y2="110" stroke="#7c3aed" stroke-width="1.5"/>
      </svg>
      <div class="cap">Students and courses are connected in many directions</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"18 Cardinality Summary",html:`<div class="inner">
  <div class="kicker">Cardinality — Summary</div>
  <div class="stitle" style="margin-bottom:36px">Three Types at a Glance</div>
  <div style="display:flex;flex-direction:column;gap:20px">
    <!-- 1:1 -->
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #0d7a72">
      <div style="min-width:80px;text-align:center;font-size:32px;font-weight:700;color:#0d7a72">1:1</div>
      <svg width="260" height="52" viewBox="0 0 260 52"><rect x="2" y="11" width="80" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="42" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">EMPLOYEE</text><line x1="82" y1="26" x2="98" y2="26" stroke="#374151" stroke-width="2"/><polygon points="118,12 148,26 118,40 88,26" fill="#fef9c3" stroke="#d97706" stroke-width="2"/><text x="118" y="30" font-size="10" font-weight="600" fill="#92400e" text-anchor="middle">holds</text><line x1="148" y1="26" x2="162" y2="26" stroke="#374151" stroke-width="2"/><rect x="162" y="11" width="88" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="206" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">PASSPORT</text><text x="86" y="10" font-size="14" font-weight="700" fill="#1d4ed8">1</text><text x="150" y="10" font-size="14" font-weight="700" fill="#1d4ed8">1</text></svg>
      <div class="small" style="color:#374151">Each instance matches <strong>exactly one</strong> on the other side</div>
    </div>
    <!-- 1:N -->
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #c47c1a">
      <div style="min-width:80px;text-align:center;font-size:32px;font-weight:700;color:#c47c1a">1:N</div>
      <svg width="260" height="52" viewBox="0 0 260 52"><rect x="2" y="11" width="80" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="42" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text><line x1="82" y1="26" x2="98" y2="26" stroke="#374151" stroke-width="2"/><polygon points="118,12 148,26 118,40 88,26" fill="#fef9c3" stroke="#d97706" stroke-width="2"/><text x="118" y="30" font-size="10" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text><line x1="148" y1="26" x2="162" y2="26" stroke="#374151" stroke-width="2"/><rect x="162" y="11" width="88" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="206" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text><text x="86" y="10" font-size="14" font-weight="700" fill="#1d4ed8">1</text><text x="150" y="10" font-size="14" font-weight="700" fill="#1d4ed8">N</text></svg>
      <div class="small" style="color:#374151">One on side A → <strong>many</strong> on side B; each B has only one A</div>
    </div>
    <!-- M:N -->
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #7c3aed">
      <div style="min-width:80px;text-align:center;font-size:32px;font-weight:700;color:#7c3aed">M:N</div>
      <svg width="260" height="52" viewBox="0 0 260 52"><rect x="2" y="11" width="80" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="42" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text><line x1="82" y1="26" x2="98" y2="26" stroke="#374151" stroke-width="2"/><polygon points="118,12 148,26 118,40 88,26" fill="#fef9c3" stroke="#d97706" stroke-width="2"/><text x="118" y="30" font-size="10" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text><line x1="148" y1="26" x2="162" y2="26" stroke="#374151" stroke-width="2"/><rect x="162" y="11" width="88" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="206" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text><text x="86" y="10" font-size="14" font-weight="700" fill="#1d4ed8">M</text><text x="150" y="10" font-size="14" font-weight="700" fill="#1d4ed8">N</text></svg>
      <div class="small" style="color:#374151">Many on side A ↔ <strong>many</strong> on side B simultaneously</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"navy2",label:"19 Sec Full ER",html:`<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">05</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Drawing a Complete ER Diagram</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:660px;line-height:1.6">Let's put it all together — step by step</p>
</div>
<div class="sec-num">05</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"20 How To Draw Steps",html:`<div class="inner">
  <div class="kicker">Section 05</div>
  <div class="stitle" style="margin-bottom:36px">How to Draw an ER Diagram</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="step"><div class="snum">1</div><div class="sbody"><strong>Identify the entities</strong> — what real-world things do we store data about? (nouns)</div></div>
      <div class="step"><div class="snum">2</div><div class="sbody"><strong>List attributes</strong> for each entity — what properties does it have?</div></div>
      <div class="step"><div class="snum">3</div><div class="sbody"><strong>Mark the key attribute</strong> — which attribute uniquely identifies each instance?</div></div>
      <div class="step"><div class="snum">4</div><div class="sbody"><strong>Identify relationships</strong> — how do entities connect? (verbs)</div></div>
      <div class="step"><div class="snum">5</div><div class="sbody"><strong>Add cardinality</strong> — 1:1, 1:N, or M:N on each relationship line</div></div>
    </div>
    <div class="card-t">
      <div class="small" style="margin-bottom:16px"><strong>Scenario:</strong> A university has <em>students</em> and <em>courses</em>. Students can enroll in many courses. Each course is taught by one teacher. Teachers can teach many courses.</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="small">📦 <strong>Entities:</strong> STUDENT, COURSE, TEACHER</div>
        <div class="small">🔗 <strong>Relationships:</strong> enrolls (M:N), teaches (1:N)</div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"21 Full ER Diagram",html:`<div class="inner">
  <div class="kicker">Section 05 — Complete Example</div>
  <div class="stitle" style="margin-bottom:28px">University Enrollment — Full ER Diagram</div>
  <div style="display:flex;justify-content:center">
    <svg width="1500" height="560" viewBox="0 0 1500 560" style="max-width:100%;height:auto">

      <!-- ══ TEACHER entity ══ -->
      <rect x="60" y="230" width="160" height="60" rx="5" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
      <text x="140" y="266" font-size="20" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>

      <!-- TEACHER attrs -->
      <!-- TeacherID (key) -->
      <ellipse cx="80" cy="110" rx="68" ry="28" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
      <text x="80" y="114" font-size="15" font-weight="700" fill="#3b0764" text-anchor="middle">TeacherID</text>
      <line x1="80" y1="126" x2="80" y2="138" stroke="#3b0764" stroke-width="1.8"/>
      <line x1="26" y1="120" x2="134" y2="120" stroke="#3b0764" stroke-width="1.5"/>
      <line x1="80" y1="138" x2="105" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- TName -->
      <ellipse cx="210" cy="110" rx="52" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="210" y="115" font-size="15" fill="#064e3b" text-anchor="middle">T_Name</text>
      <line x1="210" y1="136" x2="185" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Department -->
      <ellipse cx="310" cy="146" rx="68" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="310" y="151" font-size="15" fill="#064e3b" text-anchor="middle">Department</text>
      <line x1="272" y1="158" x2="220" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- teaches relationship -->
      <line x1="220" y1="260" x2="290" y2="260" stroke="#374151" stroke-width="2.5"/>
      <polygon points="340,234 388,260 340,286 292,260" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
      <text x="340" y="265" font-size="15" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text>
      <line x1="388" y1="260" x2="430" y2="260" stroke="#374151" stroke-width="2.5"/>
      <!-- cardinality -->
      <text x="228" y="252" font-size="22" font-weight="700" fill="#1d4ed8">1</text>
      <text x="392" y="252" font-size="22" font-weight="700" fill="#1d4ed8">N</text>

      <!-- ══ COURSE entity ══ -->
      <rect x="430" y="230" width="160" height="60" rx="5" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
      <text x="510" y="266" font-size="20" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>

      <!-- COURSE attrs -->
      <!-- CourseID (key) -->
      <ellipse cx="438" cy="110" rx="66" ry="28" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
      <text x="438" y="114" font-size="15" font-weight="700" fill="#3b0764" text-anchor="middle">CourseID</text>
      <line x1="372" y1="120" x2="504" y2="120" stroke="#3b0764" stroke-width="1.5"/>
      <line x1="438" y1="138" x2="460" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Title -->
      <ellipse cx="548" cy="100" rx="46" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="548" y="105" font-size="15" fill="#064e3b" text-anchor="middle">Title</text>
      <line x1="548" y1="126" x2="530" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Credits -->
      <ellipse cx="644" cy="116" rx="50" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="644" y="121" font-size="15" fill="#064e3b" text-anchor="middle">Credits</text>
      <line x1="614" y1="136" x2="590" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- enrolls relationship -->
      <line x1="590" y1="260" x2="680" y2="260" stroke="#374151" stroke-width="2.5"/>
      <polygon points="740,234 788,260 740,286 692,260" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
      <text x="740" y="265" font-size="15" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
      <line x1="788" y1="260" x2="840" y2="260" stroke="#374151" stroke-width="2.5"/>
      <!-- cardinality -->
      <text x="600" y="252" font-size="22" font-weight="700" fill="#1d4ed8">M</text>
      <text x="792" y="252" font-size="22" font-weight="700" fill="#1d4ed8">N</text>

      <!-- ══ STUDENT entity ══ -->
      <rect x="840" y="230" width="160" height="60" rx="5" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
      <text x="920" y="266" font-size="20" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>

      <!-- STUDENT attrs -->
      <!-- StudentID (key) -->
      <ellipse cx="860" cy="110" rx="66" ry="28" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
      <text x="860" y="114" font-size="15" font-weight="700" fill="#3b0764" text-anchor="middle">StudentID</text>
      <line x1="794" y1="120" x2="926" y2="120" stroke="#3b0764" stroke-width="1.5"/>
      <line x1="860" y1="138" x2="880" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Sname -->
      <ellipse cx="970" cy="106" rx="46" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="970" y="111" font-size="15" fill="#064e3b" text-anchor="middle">S_Name</text>
      <line x1="970" y1="132" x2="950" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Email -->
      <ellipse cx="1060" cy="110" rx="44" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="1060" y="115" font-size="15" fill="#064e3b" text-anchor="middle">Email</text>
      <line x1="1030" y1="128" x2="1000" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Major -->
      <ellipse cx="1140" cy="128" rx="46" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="1140" y="133" font-size="15" fill="#064e3b" text-anchor="middle">Major</text>
      <line x1="1118" y1="144" x2="1000" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- ══ LEGEND ══ -->
      <rect x="1200" y="200" width="270" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="1.5"/>
      <text x="1335" y="226" font-size="16" font-weight="700" fill="#1a2744" text-anchor="middle">LEGEND</text>
      <line x1="1210" y1="234" x2="1462" y2="234" stroke="#e5e7eb" stroke-width="1"/>

      <rect x="1218" y="244" width="40" height="22" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
      <text x="1268" y="260" font-size="14" fill="#374151">Entity</text>

      <ellipse cx="1238" cy="284" rx="20" ry="12" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="1268" y="289" font-size="14" fill="#374151">Attribute</text>

      <ellipse cx="1238" cy="316" rx="20" ry="12" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/>
      <text x="1230" y="319" font-size="10" font-weight="700" fill="#3b0764" text-anchor="middle">key</text>
      <line x1="1218" y1="322" x2="1258" y2="322" stroke="#3b0764" stroke-width="1.3"/>
      <text x="1268" y="321" font-size="14" fill="#374151">Key Attribute</text>

      <polygon points="1238,336 1258,348 1238,360 1218,348" fill="#fef9c3" stroke="#d97706" stroke-width="2"/>
      <text x="1268" y="353" font-size="14" fill="#374151">Relationship</text>

      <text x="1218" y="388" font-size="14" fill="#374151">1 / N / M = Cardinality</text>
    </svg>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"",label:"22 Reading the Diagram",html:`<div class="inner">
  <div class="kicker">Section 05</div>
  <div class="stitle" style="margin-bottom:32px">How to Read the Diagram</div>
  <div class="two" style="align-items:start">
    <div>
      <div class="body" style="margin-bottom:24px">Reading the university ER diagram:</div>
      <div class="step"><div class="snum" style="background:#0d7a72">→</div><div class="sbody">One <strong>TEACHER</strong> teaches many <strong>COURSES</strong> (1:N)</div></div>
      <div class="step"><div class="snum" style="background:#0d7a72">→</div><div class="sbody">One <strong>COURSE</strong> is taught by one <strong>TEACHER</strong> (back-link of 1:N)</div></div>
      <div class="step"><div class="snum" style="background:#c47c1a">→</div><div class="sbody">A <strong>STUDENT</strong> can enroll in many <strong>COURSES</strong> (M:N)</div></div>
      <div class="step"><div class="snum" style="background:#c47c1a">→</div><div class="sbody">A <strong>COURSE</strong> can have many <strong>STUDENTS</strong> enrolled (M:N)</div></div>
    </div>
    <div>
      <div class="card-t" style="margin-bottom:20px">
        <div style="font-size:24px;font-weight:700;margin-bottom:10px">What becomes what in the DB?</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px">
          <div class="small">STUDENT entity</div><div class="small">→ <strong>STUDENT table</strong></div>
          <div class="small">COURSE entity</div><div class="small">→ <strong>COURSE table</strong></div>
          <div class="small">TEACHER entity</div><div class="small">→ <strong>TEACHER table</strong></div>
          <div class="small">StudentID (key)</div><div class="small">→ <strong>Primary Key</strong></div>
          <div class="small">Name, Email…</div><div class="small">→ <strong>Columns</strong></div>
          <div class="small">enrolls (M:N)</div><div class="small">→ <strong>Junction table</strong></div>
        </div>
      </div>
      <div class="card-a">
        <div class="small">💡 Every M:N relationship becomes a separate <em>junction table</em> (e.g., ENROLLMENT) in the relational database. 1:N relationships become a <em>foreign key</em>.</div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"dark",label:"23 Key Takeaways",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.04" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g2" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#g2)"/></svg>
<div class="inner">
  <div class="kicker">Summary</div>
  <div class="stitle" style="color:white;margin-bottom:40px">Key Takeaways</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #5eead4">
      <div style="font-size:26px;font-weight:700;color:#5eead4;margin-bottom:10px">ER diagrams are design tools</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Draw before you code — saves enormous time &amp; effort later</div>
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #fbbf24">
      <div style="font-size:26px;font-weight:700;color:#fbbf24;margin-bottom:10px">Rectangle = Entity → Table</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Real-world "things" we track; become database tables</div>
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #86efac">
      <div style="font-size:26px;font-weight:700;color:#86efac;margin-bottom:10px">Ellipse = Attribute → Column</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Properties of entities; underlined ellipse = primary key</div>
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #f9a8d4">
      <div style="font-size:26px;font-weight:700;color:#f9a8d4;margin-bottom:10px">Diamond = Relationship → Link</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Verbs connecting entities; labeled with 1:1, 1:N, or M:N</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`},{classes:"navy2",label:"24 End",html:`<div class="inner center">
  <div style="font-size:96px;margin-bottom:24px">🎓</div>
  <div style="font-size:64px;font-weight:700;color:white;margin-bottom:20px">Questions?</div>
  <div style="width:80px;height:5px;background:#fbbf24;border-radius:3px;margin:0 auto 28px"></div>
  <div style="font-size:28px;color:rgba(255,255,255,.55);max-width:580px;line-height:1.7">
    MBI802 · Database Management Systems<br>Entity-Relationship Diagrams
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>`}];function xs(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),A=a.useRef(null),N=a.useRef(null),[z,M]=a.useState(.5),[S,D]=a.useState({x:0,y:0});a.useEffect(()=>{const l="er-deck-styles";if(!document.getElementById(l)){const c=document.createElement("style");c.id=l,c.textContent=ps,document.head.appendChild(c)}return()=>{document.getElementById("er-deck-styles")?.remove()}},[]),a.useEffect(()=>{const l=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",l),()=>document.removeEventListener("fullscreenchange",l)},[]),a.useEffect(()=>{const l=N.current;if(!l)return;const c=()=>{const v=l.offsetWidth,E=l.offsetHeight;if(s&&E>0){const R=Math.min(v/1920,E/1080);M(R),D({x:(v-1920*R)/2,y:(E-1080*R)/2})}else M(v/1920),D({x:0,y:0})},b=new ResizeObserver(c);return b.observe(l),c(),()=>b.disconnect()},[s]);const f=()=>{document.fullscreenElement?document.exitFullscreen():A.current?.requestFullscreen()};a.useEffect(()=>{const l=c=>{const b=c.target?.tagName;b==="INPUT"||b==="TEXTAREA"||(c.key==="ArrowRight"&&r(v=>Math.min(v+1,De.length-1)),c.key==="ArrowLeft"&&r(v=>Math.max(v-1,0)))};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[]);const g=De[t],d=De.length;return e.jsxs("div",{ref:A,style:{background:"#0f1117",borderRadius:s?0:16,overflow:"hidden",border:s?"none":"1.5px solid rgba(13,122,114,0.3)",boxShadow:s?"none":"0 8px 32px rgba(0,0,0,0.25)",...s?{display:"flex",flexDirection:"column",height:"100%"}:{}},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#F87171"}}),e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#FBBF24"}}),e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#34D399"}}),e.jsxs("span",{style:{marginLeft:10,fontFamily:"DM Mono, monospace",fontSize:12,color:"rgba(255,255,255,0.35)",letterSpacing:"0.06em"},children:["MBI802 · ER Diagrams · ",t+1," / ",d," · ← → to navigate"]})]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[!s&&e.jsxs("button",{onClick:()=>h(l=>!l),style:{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,padding:"4px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11},children:[o?e.jsx(ie,{size:13}):e.jsx(ae,{size:13}),o?"Collapse":"Expand"]}),e.jsxs("button",{onClick:f,style:{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,padding:"4px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11},title:s?"Exit fullscreen":"Fullscreen",children:[s?e.jsx(oe,{size:13}):e.jsx(re,{size:13}),s?"Exit":"Fullscreen"]})]})]}),e.jsx("div",{ref:N,style:{position:"relative",width:"100%",...s?{flex:1}:{paddingBottom:o?"75%":"56.25%",transition:"padding-bottom 0.3s ease"},overflow:"hidden",background:"#111"},children:e.jsx("div",{style:{position:"absolute",inset:0,overflow:"hidden"},children:e.jsx("div",{className:"erd",style:{width:1920,height:1080,transform:`translate(${S.x}px, ${S.y}px) scale(${z})`,transformOrigin:"top left",position:"relative"},children:e.jsx("section",{className:g.classes||void 0,style:{position:"absolute",inset:0,width:"100%",height:"100%"},dangerouslySetInnerHTML:{__html:g.html}})})})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:16,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0},children:[e.jsxs("button",{onClick:()=>r(l=>Math.max(l-1,0)),disabled:t===0,style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 14px",color:t===0?"rgba(255,255,255,0.2)":"#fff",cursor:t===0?"default":"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13},children:[e.jsx(le,{size:14})," Prev"]}),e.jsx("div",{style:{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"center",maxWidth:360},children:De.map((l,c)=>e.jsx("button",{onClick:()=>r(c),title:De[c].label,style:{width:c===t?20:7,height:7,borderRadius:999,background:c===t?"#0d7a72":"rgba(255,255,255,0.2)",border:"none",padding:0,cursor:"pointer",transition:"all 0.25s ease",flexShrink:0}},c))}),e.jsxs("button",{onClick:()=>r(l=>Math.min(l+1,d-1)),disabled:t===d-1,style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 14px",color:t===d-1?"rgba(255,255,255,0.2)":"#fff",cursor:t===d-1?"default":"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13},children:["Next ",e.jsx(X,{size:14})]})]})]})}function Ve({videos:t,accentColor:r="#0d7a72"}){const[o,h]=a.useState(null);return t.length===0?null:e.jsxs("div",{className:"mt-6 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-7 h-7 rounded-lg flex items-center justify-center",style:{background:`${r}15`,color:r},children:e.jsx(rt,{size:14})}),e.jsx("h4",{className:"text-sm font-bold",style:{color:"#1e1b4b"},children:"Video Lessons"}),e.jsxs("span",{className:"text-xs font-semibold px-2 py-0.5 rounded-full",style:{background:`${r}12`,color:r},children:[t.length," clip",t.length!==1?"s":""]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:t.map((s,w)=>{const A=o===w,N=!!s.embedUrl;return A&&N?e.jsxs("div",{className:"rounded-2xl overflow-hidden",style:{border:`1.5px solid ${r}30`},children:[e.jsx("div",{className:"aspect-video w-full",children:e.jsx("iframe",{src:s.embedUrl,title:s.title,allowFullScreen:!0,className:"w-full h-full border-none"})}),e.jsxs("div",{className:"flex items-center justify-between px-3 py-2",style:{background:"rgba(255,255,255,0.97)"},children:[e.jsx("p",{className:"text-sm font-semibold truncate",style:{color:"#1e1b4b"},children:s.title}),e.jsx("button",{onClick:()=>h(null),className:"ml-3 flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-70",style:{background:`${r}12`,color:r},children:"Close"})]})]},w):e.jsxs("button",{onClick:()=>N?h(w):window.open(s.url,"_blank","noreferrer"),className:"text-left rounded-2xl overflow-hidden group transition-all hover:shadow-lg",style:{border:`1.5px solid ${r}20`,background:"rgba(255,255,255,0.92)"},children:[e.jsxs("div",{className:"relative aspect-video w-full overflow-hidden",style:{background:s.thumbnailUrl?void 0:`linear-gradient(135deg, ${r}14, ${r}07)`},children:[s.thumbnailUrl&&e.jsx("img",{src:s.thumbnailUrl,alt:s.title,className:"w-full h-full object-cover"}),!s.thumbnailUrl&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx(rt,{size:36,style:{color:`${r}40`}})}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{background:"rgba(0,0,0,0.10)"},children:e.jsx("div",{className:`w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                                group-hover:scale-110 transition-transform duration-150`,style:{background:r},children:N?e.jsx(Ft,{size:18,color:"white",style:{marginLeft:2}}):e.jsx(ce,{size:16,color:"white"})})}),!N&&e.jsx("span",{className:"absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full",style:{background:"rgba(0,0,0,0.52)",color:"#fff"},children:"Opens in new tab"})]}),e.jsxs("div",{className:"px-3 py-3",children:[e.jsx("p",{className:"text-sm font-semibold leading-snug",style:{color:"#1e1b4b"},children:s.title}),s.description&&e.jsx("p",{className:"text-xs mt-0.5 leading-5",style:{color:"#6b7280"},children:s.description})]})]},w)})})]})}const fs=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

.era *{box-sizing:border-box;margin:0;padding:0}
.era section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.era .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none}
.era .cr-light{color:rgba(255,255,255,.35)}
.era .cr-dark{color:#94a3b8}

.era .s-title{background:#0b1728;justify-content:center;align-items:center}
.era .s-title .inner{text-align:center}
.era .s-title .eyebrow{font-size:24px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;margin-bottom:28px;font-weight:500}
.era .s-title h1{font-family:'Playfair Display',serif;font-size:90px;color:#f8fafc;line-height:1.05;margin-bottom:32px}
.era .s-title .sub{font-size:26px;color:#94a3b8;font-weight:300;letter-spacing:.03em}
.era .s-title .deco-line{width:120px;height:3px;background:#60a5fa;margin:36px auto}

.era .s-legend{background:#0d1f36}
.era .s-legend .leg-header{padding:52px 100px 0}
.era .s-legend .leg-header h2{font-family:'Playfair Display',serif;font-size:48px;color:#f1f5f9}

.era .s-act{background:#fdfaf5}
.era .s-act .act-top{display:flex;height:100%}
.era .s-act .act-left{width:840px;flex-shrink:0;padding:70px 80px 70px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.era .s-act .act-right{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;position:relative}
.era .act-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:28px;width:fit-content}
.era .act-left h2{font-family:'Playfair Display',serif;font-size:46px;color:#0f172a;line-height:1.1;margin-bottom:32px}
.era .scenario-text{font-size:21px;color:#334155;line-height:1.7;margin-bottom:32px;flex:1}
.era .scenario-text strong{color:#0f172a;font-weight:600}
.era .entities-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px}
.era .entity-pill{padding:6px 18px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.03em}
.era .task-card{border-radius:12px;padding:24px 30px;border-left:5px solid}
.era .task-card .task-title{font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.era .task-card ul{list-style:none;padding:0}
.era .task-card ul li{font-size:18px;color:#1e293b;padding:4px 0;display:flex;align-items:flex-start;gap:10px}
.era .task-card ul li::before{content:'→';font-weight:700;flex-shrink:0;margin-top:1px}

.era .s-ans{background:#f4f6fb}
.era .ans-header{padding:0 90px;height:96px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #dde3f5;flex-shrink:0;background:#fff}
.era .ans-badge{padding:7px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.era .ans-header h2{font-family:'Playfair Display',serif;font-size:36px;color:#0f172a}
.era .ans-header .micro-legend{margin-left:auto;display:flex;gap:28px;align-items:center}
.era .micro-legend-item{display:flex;align-items:center;gap:10px;font-size:16px;color:#475569;font-weight:500}
.era .ml-entity{width:36px;height:20px;background:#1e40af;border-radius:2px}
.era .ml-rel{width:20px;height:20px;background:#92400e;transform:rotate(45deg);flex-shrink:0}
.era .ml-attr{width:40px;height:22px;border:2px solid #64748b;border-radius:50%}
.era .ans-diagram{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 70px 56px;min-height:0}
.era .ans-diagram svg{width:100%;height:100%;display:block;overflow:visible}
.era .et{font:700 22px 'DM Sans',sans-serif;fill:white}
.era .rt{font:700 18px 'DM Sans',sans-serif;fill:white}
.era .at{font:500 17px 'DM Sans',sans-serif;fill:#1e293b}
.era .ct{font:700 28px 'DM Sans',sans-serif}
.era .ln{stroke:#94a3b8;stroke-width:2.5;fill:none}`,Ae=[{classes:"s-title",label:"01 Title",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="120" r="320" fill="rgba(96,165,250,0.05)"/>
  <circle cx="1750" cy="180" r="180" fill="rgba(96,165,250,0.07)"/>
  <circle cx="200"  cy="950" r="280" fill="rgba(96,165,250,0.04)"/>
  <pattern id="era-dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
    <circle cx="30" cy="30" r="1.5" fill="rgba(148,163,184,0.2)"/>
  </pattern>
  <rect width="1920" height="1080" fill="url(#era-dots)"/>
</svg>
<div class="inner">
  <p class="eyebrow">Database Design · Activity Series</p>
  <h1>ER Diagram<br/>Activities</h1>
  <div class="deco-line"></div>
  <p class="sub">Chen's Notation · 5 Real-World Scenarios</p>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-legend",label:"02 Notation Legend",html:`<div class="leg-header">
  <h2>Chen's Notation — Symbol Reference</h2>
  <p style="font-size:24px;color:#64748b;margin-top:8px">Use this guide while completing each activity</p>
</div>
<svg viewBox="0 0 1720 760" style="width:100%;flex:1;padding:0 40px">
  <g transform="translate(170,130)">
    <rect x="-85" y="-36" width="170" height="72" rx="3" fill="#1e40af"/>
    <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="20" fill="white" font-weight="700">ENTITY</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Entity</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">A real-world object or concept</text>
  </g>
  <g transform="translate(530,130)">
    <rect x="-85" y="-36" width="170" height="72" rx="3" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <rect x="-77" y="-28" width="154" height="56" rx="2" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="18" fill="#60a5fa" font-weight="700">ENTITY</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Weak Entity</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Depends on a strong entity</text>
  </g>
  <g transform="translate(900,130)">
    <polygon points="0,-60 110,0 0,60 -110,0" fill="#92400e"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="18" fill="white" font-weight="700">REL</text>
    <text x="0" y="84" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Relationship</text>
    <text x="0" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Association between entities</text>
  </g>
  <g transform="translate(1320,130)">
    <polygon points="0,-60 110,0 0,60 -110,0" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
    <polygon points="0,-50 94,0 0,50 -94,0" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b" font-weight="700">REL</text>
    <text x="0" y="84" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Identifying Rel.</text>
    <text x="0" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Links weak entity to strong</text>
  </g>
  <line x1="100" y1="310" x2="1620" y2="310" stroke="#1e3a5a" stroke-width="1"/>
  <g transform="translate(170,420)">
    <ellipse rx="85" ry="36" fill="white" stroke="#475569" stroke-width="2"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="16" fill="#1e293b">attribute</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Attribute</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Property of an entity</text>
  </g>
  <g transform="translate(530,420)">
    <ellipse rx="85" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
    <text text-anchor="middle" dy="2" font-family="'DM Sans',sans-serif" font-size="16" fill="#1e293b" font-weight="600">attribute</text>
    <line x1="-45" y1="10" x2="45" y2="10" stroke="#1e293b" stroke-width="2"/>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Key Attribute</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Uniquely identifies entity (PK)</text>
  </g>
  <g transform="translate(900,420)">
    <ellipse rx="85" ry="36" fill="none" stroke="#475569" stroke-width="2"/>
    <ellipse rx="73" ry="25" fill="white" stroke="#475569" stroke-width="2"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="14" fill="#1e293b">{attribute}</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Multi-valued</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Can have multiple values</text>
  </g>
  <g transform="translate(1320,420)">
    <ellipse rx="85" ry="36" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="8,5"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="16" fill="#475569" font-style="italic">attribute</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Derived Attribute</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Calculated from other attributes</text>
  </g>
  <g transform="translate(100,630)">
    <text font-family="'DM Sans',sans-serif" font-size="16" fill="#64748b" font-weight="500">CARDINALITY NOTATION</text>
    <line x1="0" y1="40" x2="220" y2="40" stroke="#475569" stroke-width="2"/>
    <text x="10"  y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#1e40af" font-weight="700">1</text>
    <text x="210" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#1e40af" font-weight="700">1</text>
    <text x="110" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">One-to-One (1:1)</text>
    <line x1="340" y1="40" x2="560" y2="40" stroke="#475569" stroke-width="2"/>
    <text x="350" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#1e40af" font-weight="700">1</text>
    <text x="550" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#dc2626" font-weight="700">N</text>
    <text x="450" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">One-to-Many (1:N)</text>
    <line x1="680" y1="40" x2="900" y2="40" stroke="#475569" stroke-width="2"/>
    <text x="690" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#dc2626" font-weight="700">M</text>
    <text x="890" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#dc2626" font-weight="700">N</text>
    <text x="790" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">Many-to-Many (M:N)</text>
  </g>
</svg>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"03 Activity 1 – Library",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.4" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#bfdbfe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="340" fill="none" stroke="#bfdbfe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="180" fill="none" stroke="#bfdbfe" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#dbeafe;color:#1d4ed8;">Activity 01</div>
    <h2>Library Management System</h2>
    <p class="scenario-text">A <strong>library</strong> lends books to its members. Each <strong>book</strong> has an ISBN, title, and genre. Each <strong>member</strong> has a member ID, name, and email address.<br><br>A member can <strong>borrow</strong> multiple books over time, and the same book may be borrowed by many different members. Each borrowing transaction records a <em>borrow date</em> and a <em>return date</em>.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#dbeafe;color:#1e40af;">MEMBER</span>
      <span class="entity-pill" style="background:#dbeafe;color:#1e40af;">BOOK</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">BORROWS</span>
    </div>
    <div class="task-card" style="background:#eff6ff;border-color:#1d4ed8;">
      <div class="task-title" style="color:#1d4ed8;">Your Task</div>
      <ul>
        <li>Identify all entities and their attributes</li>
        <li>Mark each primary key (underline it)</li>
        <li>Draw the BORROWS relationship with correct cardinality</li>
        <li>Add relationship attributes (BorrowDate, ReturnDate)</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 420 380" style="width:380px;height:auto">
      <rect x="20" y="310" width="380" height="16" rx="4" fill="#d1c4a8"/>
      <rect x="40"  y="140" width="52" height="172" rx="4" fill="#1d4ed8"/>
      <rect x="100" y="110" width="44" height="200" rx="4" fill="#7c3aed"/>
      <rect x="152" y="150" width="38" height="160" rx="4" fill="#dc2626"/>
      <rect x="198" y="125" width="50" height="185" rx="4" fill="#059669"/>
      <rect x="256" y="155" width="42" height="155" rx="4" fill="#d97706"/>
      <rect x="306" y="130" width="46" height="180" rx="4" fill="#0891b2"/>
      <g transform="translate(90,260)">
        <path d="M0,0 Q30,-20 60,0 Q90,-20 120,0 L120,60 Q90,40 60,60 Q30,40 0,60 Z" fill="#fef9ee" stroke="#d1c4a8" stroke-width="1.5"/>
        <line x1="60" y1="0" x2="60" y2="60" stroke="#d1c4a8" stroke-width="1"/>
        <line x1="10" y1="20" x2="55" y2="22" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="10" y1="30" x2="55" y2="32" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="65" y1="20" x2="110" y2="22" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="65" y1="30" x2="110" y2="32" stroke="#cbd5e1" stroke-width="1"/>
      </g>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"04 Answer 1 – Library",html:`<div class="ans-header">
  <span class="ans-badge" style="background:#dbeafe;color:#1d4ed8;">Answer 01</span>
  <h2>Library Management System</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1720 600" preserveAspectRatio="xMidYMid meet">
    <line x1="295" y1="300" x2="855" y2="300" class="ln"/>
    <line x1="855" y1="300" x2="1415" y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="115" class="ln"/>
    <line x1="295" y1="300" x2="48"  y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="485" class="ln"/>
    <line x1="855" y1="300" x2="625" y2="95"  class="ln"/>
    <line x1="855" y1="300" x2="1085" y2="95" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="115" class="ln"/>
    <line x1="1415" y1="300" x2="1662" y2="300" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="485" class="ln"/>
    <polygon points="855,228 970,300 855,372 740,300" fill="#92400e"/>
    <text x="855" y="306" text-anchor="middle" class="rt">BORROWS</text>
    <rect x="195" y="265" width="200" height="70" rx="3" fill="#1e40af"/>
    <text x="295" y="306" text-anchor="middle" class="et">MEMBER</text>
    <rect x="1315" y="265" width="200" height="70" rx="3" fill="#1e40af"/>
    <text x="1415" y="306" text-anchor="middle" class="et">BOOK</text>
    <ellipse cx="100" cy="100" rx="95" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
    <text x="100" y="97" text-anchor="middle" class="at" font-weight="600">MemberID</text>
    <line x1="28" y1="108" x2="172" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="48" cy="300" rx="80" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="48" y="305" text-anchor="middle" class="at">Name</text>
    <ellipse cx="100" cy="490" rx="80" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="100" y="495" text-anchor="middle" class="at">Email</text>
    <ellipse cx="625"  cy="78" rx="105" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="625"  y="83" text-anchor="middle" class="at">BorrowDate</text>
    <ellipse cx="1085" cy="78" rx="105" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1085" y="83" text-anchor="middle" class="at">ReturnDate</text>
    <ellipse cx="1610" cy="100" rx="82" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
    <text x="1610" y="97" text-anchor="middle" class="at" font-weight="600">ISBN</text>
    <line x1="1546" y1="108" x2="1674" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1662" cy="300" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1662" y="305" text-anchor="middle" class="at">Title</text>
    <ellipse cx="1610" cy="490" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1610" y="495" text-anchor="middle" class="at">Genre</text>
    <text x="590"  y="275" text-anchor="middle" class="ct" fill="#1d4ed8">M</text>
    <text x="1120" y="275" text-anchor="middle" class="ct" fill="#1d4ed8">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"05 Activity 2 – University",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#ddd6fe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="340" fill="none" stroke="#ddd6fe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="180" fill="none" stroke="#ddd6fe" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#ede9fe;color:#7c3aed;">Activity 02</div>
    <h2>University Course Enrollment</h2>
    <p class="scenario-text">A <strong>university</strong> manages student enrollments in courses. Each <strong>student</strong> has a student ID, full name, and GPA. Each <strong>course</strong> has a course code, title, and number of credits.<br><br>Students can <strong>enroll in</strong> multiple courses each semester, and each course can have many students enrolled. The enrollment records the <em>semester</em> and <em>grade</em> the student received.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#ede9fe;color:#7c3aed;">STUDENT</span>
      <span class="entity-pill" style="background:#ede9fe;color:#7c3aed;">COURSE</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">ENROLLS_IN</span>
    </div>
    <div class="task-card" style="background:#f5f3ff;border-color:#7c3aed;">
      <div class="task-title" style="color:#7c3aed;">Your Task</div>
      <ul>
        <li>Identify all entities and their key attributes</li>
        <li>Determine the cardinality of the enrollment relationship</li>
        <li>Add Semester and Grade as relationship attributes</li>
        <li>Underline the primary key in each entity</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 400 360" style="width:360px;height:auto">
      <rect x="60" y="160" width="280" height="160" fill="#7c3aed" rx="4"/>
      <rect x="80"  y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="130" y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="250" y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="300" y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="95"  y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="150" y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="215" y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="270" y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="95"  y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="150" y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="215" y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="270" y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="175" y="280" width="50" height="40" rx="3" fill="#4c1d95"/>
      <polygon points="40,160 200,60 360,160" fill="#5b21b6"/>
      <rect x="80"  y="130" width="16" height="30" fill="#6d28d9"/>
      <rect x="180" y="100" width="16" height="60" fill="#6d28d9"/>
      <rect x="304" y="130" width="16" height="30" fill="#6d28d9"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"06 Answer 2 – University",html:`<div class="ans-header">
  <span class="ans-badge" style="background:#ede9fe;color:#7c3aed;">Answer 02</span>
  <h2>University Course Enrollment</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1720 600" preserveAspectRatio="xMidYMid meet">
    <line x1="295" y1="300" x2="855" y2="300" class="ln"/>
    <line x1="855" y1="300" x2="1415" y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="115" class="ln"/>
    <line x1="295" y1="300" x2="48"  y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="485" class="ln"/>
    <line x1="855" y1="300" x2="625" y2="95"  class="ln"/>
    <line x1="855" y1="300" x2="1085" y2="95" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="115" class="ln"/>
    <line x1="1415" y1="300" x2="1662" y2="300" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="485" class="ln"/>
    <polygon points="855,228 970,300 855,372 740,300" fill="#6d28d9"/>
    <text x="855" y="298" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="white" font-weight="700">ENROLLS</text>
    <text x="855" y="317" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="white" font-weight="700">_IN</text>
    <rect x="195" y="265" width="200" height="70" rx="3" fill="#6d28d9"/>
    <text x="295" y="306" text-anchor="middle" class="et">STUDENT</text>
    <rect x="1315" y="265" width="200" height="70" rx="3" fill="#6d28d9"/>
    <text x="1415" y="306" text-anchor="middle" class="et">COURSE</text>
    <ellipse cx="100" cy="100" rx="100" ry="36" fill="#ede9fe" stroke="#6d28d9" stroke-width="2.5"/>
    <text x="100" y="97" text-anchor="middle" class="at" font-weight="600">StudentID</text>
    <line x1="24"  y1="108" x2="176" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="48"  cy="300" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="48"  y="305" text-anchor="middle" class="at">Name</text>
    <ellipse cx="100" cy="490" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="100" y="495" text-anchor="middle" class="at">GPA</text>
    <ellipse cx="625"  cy="78" rx="105" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="625"  y="83" text-anchor="middle" class="at">Semester</text>
    <ellipse cx="1085" cy="78" rx="90"  ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1085" y="83" text-anchor="middle" class="at">Grade</text>
    <ellipse cx="1610" cy="100" rx="105" ry="36" fill="#ede9fe" stroke="#6d28d9" stroke-width="2.5"/>
    <text x="1610" y="97" text-anchor="middle" class="at" font-weight="600">CourseCode</text>
    <line x1="1530" y1="108" x2="1690" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1662" cy="300" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1662" y="305" text-anchor="middle" class="at">Title</text>
    <ellipse cx="1610" cy="490" rx="85" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1610" y="495" text-anchor="middle" class="at">Credits</text>
    <text x="590"  y="275" text-anchor="middle" class="ct" fill="#7c3aed">M</text>
    <text x="1120" y="275" text-anchor="middle" class="ct" fill="#7c3aed">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"07 Activity 3 – Hospital",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#fecaca" stroke-width="1"/>
  <circle cx="1700" cy="540" r="320" fill="none" stroke="#fecaca" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#fee2e2;color:#dc2626;">Activity 03</div>
    <h2>Hospital Patient Management</h2>
    <p class="scenario-text">A <strong>hospital</strong> manages doctors, patients, and departments. Each <strong>doctor</strong> has a doctor ID, name, and specialization. Each <strong>patient</strong> has a patient ID, name, and date of birth. Each <strong>department</strong> has a department ID and name.<br><br>Each doctor <strong>works in</strong> exactly one department (a department has many doctors). Doctors can <strong>treat</strong> many patients, and patients may be treated by many doctors. Each treatment records a <em>treatment date</em>.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#fee2e2;color:#dc2626;">DOCTOR</span>
      <span class="entity-pill" style="background:#fee2e2;color:#dc2626;">PATIENT</span>
      <span class="entity-pill" style="background:#fee2e2;color:#dc2626;">DEPARTMENT</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">WORKS_IN</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">TREATS</span>
    </div>
    <div class="task-card" style="background:#fff1f2;border-color:#dc2626;">
      <div class="task-title" style="color:#dc2626;">Your Task</div>
      <ul>
        <li>Draw all three entities with their attributes and PKs</li>
        <li>Show WORKS_IN (M:1) between DOCTOR and DEPARTMENT</li>
        <li>Show TREATS (M:N) between DOCTOR and PATIENT</li>
        <li>Add TreatmentDate as a relationship attribute on TREATS</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 380 360" style="width:340px;height:auto">
      <rect x="60" y="120" width="260" height="210" fill="#dc2626" rx="4"/>
      <rect x="80"  y="145" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="167" y="145" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="255" y="145" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="80"  y="207" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="255" y="207" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="158" y="270" width="64" height="60" rx="3" fill="#991b1b"/>
      <rect x="40" y="108" width="300" height="20" rx="3" fill="#b91c1c"/>
      <line x1="190" y1="20" x2="190" y2="110" stroke="#b91c1c" stroke-width="3"/>
      <rect x="190" y="20" width="40" height="24" fill="#fca5a5" rx="2"/>
      <rect x="20" y="328" width="340" height="12" rx="4" fill="#d1c4a8"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"08 Answer 3 – Hospital",html:`<div class="ans-header">
  <span class="ans-badge" style="background:#fee2e2;color:#dc2626;">Answer 03</span>
  <h2>Hospital Patient Management</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1760 640" preserveAspectRatio="xMidYMid meet">
    <line x1="280" y1="440" x2="600" y2="270" class="ln"/>
    <line x1="600" y1="270" x2="1000" y2="170" class="ln"/>
    <line x1="280" y1="440" x2="860" y2="440" class="ln"/>
    <line x1="860" y1="440" x2="1440" y2="440" class="ln"/>
    <line x1="280" y1="440" x2="85"  y2="290" class="ln"/>
    <line x1="280" y1="440" x2="45"  y2="440" class="ln"/>
    <line x1="280" y1="440" x2="85"  y2="580" class="ln"/>
    <line x1="1000" y1="170" x2="840" y2="58"  class="ln"/>
    <line x1="1000" y1="170" x2="1200" y2="75" class="ln"/>
    <line x1="1440" y1="440" x2="1635" y2="290" class="ln"/>
    <line x1="1440" y1="440" x2="1675" y2="440" class="ln"/>
    <line x1="1440" y1="440" x2="1635" y2="580" class="ln"/>
    <line x1="860" y1="440" x2="860" y2="560" class="ln"/>
    <polygon points="600,200 690,270 600,340 510,270" fill="#b91c1c"/>
    <text x="600" y="266" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="white" font-weight="700">WORKS</text>
    <text x="600" y="283" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="white" font-weight="700">_IN</text>
    <polygon points="860,372 960,440 860,508 760,440" fill="#b91c1c"/>
    <text x="860" y="446" text-anchor="middle" class="rt">TREATS</text>
    <rect x="180" y="405" width="200" height="70" rx="3" fill="#dc2626"/>
    <text x="280" y="446" text-anchor="middle" class="et">DOCTOR</text>
    <rect x="900" y="135" width="200" height="70" rx="3" fill="#dc2626"/>
    <text x="1000" y="176" text-anchor="middle" class="et">DEPARTMENT</text>
    <rect x="1340" y="405" width="200" height="70" rx="3" fill="#dc2626"/>
    <text x="1440" y="446" text-anchor="middle" class="et">PATIENT</text>
    <ellipse cx="85"  cy="272" rx="95"  ry="34" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="85"  y="269" text-anchor="middle" class="at" font-weight="600">DoctorID</text>
    <line x1="14"  y1="278" x2="156" y2="278" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="45"  cy="440" rx="72"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="45"  y="445" text-anchor="middle" class="at">Name</text>
    <ellipse cx="85"  cy="590" rx="108" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="85"  y="595" text-anchor="middle" class="at">Specialization</text>
    <ellipse cx="840"  cy="40" rx="88"  ry="34" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="840"  y="37" text-anchor="middle" class="at" font-weight="600">DeptID</text>
    <line x1="776"  y1="46" x2="904" y2="46" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1210" cy="55" rx="100" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1210" y="60" text-anchor="middle" class="at">DeptName</text>
    <ellipse cx="1635" cy="272" rx="95"  ry="34" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="1635" y="269" text-anchor="middle" class="at" font-weight="600">PatientID</text>
    <line x1="1564" y1="278" x2="1706" y2="278" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1675" cy="440" rx="72"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1675" y="445" text-anchor="middle" class="at">Name</text>
    <ellipse cx="1635" cy="590" rx="72"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1635" y="595" text-anchor="middle" class="at">DOB</text>
    <ellipse cx="860"  cy="578" rx="115" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="860"  y="583" text-anchor="middle" class="at">TreatmentDate</text>
    <text x="424" y="385" text-anchor="middle" class="ct" fill="#dc2626">M</text>
    <text x="808" y="218" text-anchor="middle" class="ct" fill="#dc2626">1</text>
    <text x="556" y="424" text-anchor="middle" class="ct" fill="#dc2626">M</text>
    <text x="1165" y="424" text-anchor="middle" class="ct" fill="#dc2626">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"09 Activity 4 – Online Store",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#fde68a" stroke-width="1"/>
  <circle cx="1700" cy="540" r="320" fill="none" stroke="#fde68a" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#fef3c7;color:#d97706;">Activity 04</div>
    <h2>Online Store Orders</h2>
    <p class="scenario-text">An <strong>online store</strong> tracks customers, their orders, and products. Each <strong>customer</strong> has a customer ID, name, and address. Each <strong>product</strong> has a product ID, name, and unit price. Each <strong>order</strong> has an order ID and order date.<br><br>A customer can <strong>place</strong> many orders (each order belongs to one customer). An order can <strong>contain</strong> multiple products, and a product can appear in many orders. Each order-line records the <em>quantity</em> ordered.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#fef3c7;color:#d97706;">CUSTOMER</span>
      <span class="entity-pill" style="background:#fef3c7;color:#d97706;">ORDER</span>
      <span class="entity-pill" style="background:#fef3c7;color:#d97706;">PRODUCT</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">PLACES</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">CONTAINS</span>
    </div>
    <div class="task-card" style="background:#fffbeb;border-color:#d97706;">
      <div class="task-title" style="color:#d97706;">Your Task</div>
      <ul>
        <li>Draw all three entities with their key attributes</li>
        <li>Show PLACES (1:N) between CUSTOMER and ORDER</li>
        <li>Show CONTAINS (M:N) between ORDER and PRODUCT</li>
        <li>Add Quantity as a relationship attribute on CONTAINS</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 380 360" style="width:340px;height:auto">
      <path d="M60,120 L60,310 Q60,330 80,330 L300,330 Q320,330 320,310 L320,120 Z" fill="#d97706"/>
      <rect x="60" y="108" width="260" height="22" rx="4" fill="#b45309"/>
      <path d="M130,108 Q130,50 190,50 Q250,50 250,108" fill="none" stroke="#92400e" stroke-width="14" stroke-linecap="round"/>
      <rect x="90"  y="160" width="70" height="80" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
      <rect x="100" y="170" width="50" height="10" rx="2" fill="#d97706"/>
      <rect x="180" y="145" width="70" height="95" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
      <rect x="190" y="157" width="50" height="10" rx="2" fill="#d97706"/>
      <rect x="240" y="258" width="60" height="30" rx="4" fill="white" stroke="#d97706" stroke-width="1.5"/>
      <text x="270" y="278" text-anchor="middle" font-size="14" font-family="monospace" fill="#d97706" font-weight="700">$24</text>
      <rect x="20" y="338" width="340" height="12" rx="4" fill="#d1c4a8"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"10 Answer 4 – Online Store",html:`<div class="ans-header">
  <span class="ans-badge" style="background:#fef3c7;color:#d97706;">Answer 04</span>
  <h2>Online Store Orders</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1740 590" preserveAspectRatio="xMidYMid meet">
    <line x1="185" y1="310" x2="510" y2="310" class="ln"/>
    <line x1="510" y1="310" x2="845" y2="310" class="ln"/>
    <line x1="845" y1="310" x2="1180" y2="310" class="ln"/>
    <line x1="1180" y1="310" x2="1535" y2="310" class="ln"/>
    <line x1="185" y1="310" x2="65"  y2="148" class="ln"/>
    <line x1="185" y1="310" x2="0"   y2="320" class="ln"/>
    <line x1="185" y1="310" x2="65"  y2="475" class="ln"/>
    <line x1="845" y1="310" x2="845" y2="148" class="ln"/>
    <line x1="845" y1="310" x2="845" y2="475" class="ln"/>
    <line x1="1180" y1="310" x2="1180" y2="148" class="ln"/>
    <line x1="1535" y1="310" x2="1655" y2="148" class="ln"/>
    <line x1="1535" y1="310" x2="1720" y2="320" class="ln"/>
    <line x1="1535" y1="310" x2="1655" y2="475" class="ln"/>
    <polygon points="510,242 620,310 510,378 400,310" fill="#b45309"/>
    <text x="510" y="316" text-anchor="middle" class="rt">PLACES</text>
    <polygon points="1180,242 1290,310 1180,378 1070,310" fill="#b45309"/>
    <text x="1180" y="316" text-anchor="middle" class="rt">CONTAINS</text>
    <rect x="85"  y="275" width="200" height="70" rx="3" fill="#d97706"/>
    <text x="185" y="316" text-anchor="middle" class="et">CUSTOMER</text>
    <rect x="745" y="275" width="200" height="70" rx="3" fill="#d97706"/>
    <text x="845" y="316" text-anchor="middle" class="et">ORDER</text>
    <rect x="1435" y="275" width="200" height="70" rx="3" fill="#d97706"/>
    <text x="1535" y="316" text-anchor="middle" class="et">PRODUCT</text>
    <ellipse cx="65"  cy="128" rx="105" ry="36" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="65"  y="125" text-anchor="middle" class="at" font-weight="600">CustomerID</text>
    <line x1="-20" y1="135" x2="150" y2="135" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="0"   cy="320" rx="72"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="0"   y="325" text-anchor="middle" class="at">Name</text>
    <ellipse cx="65"  cy="490" rx="88"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="65"  y="495" text-anchor="middle" class="at">Address</text>
    <ellipse cx="845" cy="125" rx="90"  ry="36" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="845" y="122" text-anchor="middle" class="at" font-weight="600">OrderID</text>
    <line x1="775" y1="132" x2="915" y2="132" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="845" cy="490" rx="100" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="845" y="495" text-anchor="middle" class="at">OrderDate</text>
    <ellipse cx="1180" cy="120" rx="96"  ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1180" y="125" text-anchor="middle" class="at">Quantity</text>
    <ellipse cx="1655" cy="128" rx="98"  ry="36" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="1655" y="125" text-anchor="middle" class="at" font-weight="600">ProductID</text>
    <line x1="1577" y1="135" x2="1733" y2="135" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1720" cy="320" rx="74"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1720" y="325" text-anchor="middle" class="at">Name</text>
    <ellipse cx="1655" cy="490" rx="74"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1655" y="495" text-anchor="middle" class="at">Price</text>
    <text x="360"  y="288" text-anchor="middle" class="ct" fill="#d97706">1</text>
    <text x="660"  y="288" text-anchor="middle" class="ct" fill="#d97706">N</text>
    <text x="1035" y="288" text-anchor="middle" class="ct" fill="#d97706">M</text>
    <text x="1325" y="288" text-anchor="middle" class="ct" fill="#d97706">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"11 Activity 5 – Hotel",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#a7f3d0" stroke-width="1"/>
  <circle cx="1700" cy="540" r="320" fill="none" stroke="#a7f3d0" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#d1fae5;color:#059669;">Activity 05</div>
    <h2>Hotel Room Booking</h2>
    <p class="scenario-text">A <strong>hotel</strong> manages guest reservations for its rooms. Each <strong>guest</strong> has a guest ID, full name, and phone number. Each <strong>room</strong> has a room number, room type (single/double/suite), and nightly rate.<br><br>A guest can <strong>book</strong> multiple rooms over different stays, and the same room can be booked by many guests across different periods. Each booking records a <em>check-in date</em> and a <em>check-out date</em>.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#d1fae5;color:#059669;">GUEST</span>
      <span class="entity-pill" style="background:#d1fae5;color:#059669;">ROOM</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">BOOKS</span>
    </div>
    <div class="task-card" style="background:#ecfdf5;border-color:#059669;">
      <div class="task-title" style="color:#059669;">Your Task</div>
      <ul>
        <li>Identify all entities and their primary keys</li>
        <li>Determine the correct cardinality for BOOKS</li>
        <li>Add CheckInDate and CheckOutDate as relationship attributes</li>
        <li>Ensure all attributes connect to the correct entity or relationship</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 380 360" style="width:340px;height:auto">
      <rect x="80" y="100" width="220" height="228" fill="#059669" rx="4"/>
      <rect x="30" y="160" width="60" height="168" fill="#047857" rx="4"/>
      <rect x="290" y="160" width="60" height="168" fill="#047857" rx="4"/>
      <rect x="100" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="145" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="190" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="235" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="100" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="145" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="190" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="235" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="100" y="210" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="235" y="210" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="38" y="178" width="28" height="22" rx="2" fill="#a7f3d0"/>
      <rect x="314" y="178" width="28" height="22" rx="2" fill="#a7f3d0"/>
      <rect x="155" y="268" width="70" height="60" rx="3" fill="#064e3b"/>
      <rect x="135" y="78" width="110" height="28" rx="4" fill="#065f46"/>
      <text x="190" y="97" text-anchor="middle" font-size="16" font-family="'DM Sans',sans-serif" fill="#a7f3d0" font-weight="700" letter-spacing="3">HOTEL</text>
      <rect x="10" y="328" width="360" height="12" rx="4" fill="#d1c4a8"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"12 Answer 5 – Hotel",html:`<div class="ans-header">
  <span class="ans-badge" style="background:#d1fae5;color:#059669;">Answer 05</span>
  <h2>Hotel Room Booking</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1720 600" preserveAspectRatio="xMidYMid meet">
    <line x1="295"  y1="300" x2="855"  y2="300" class="ln"/>
    <line x1="855"  y1="300" x2="1415" y2="300" class="ln"/>
    <line x1="295"  y1="300" x2="100"  y2="115" class="ln"/>
    <line x1="295"  y1="300" x2="48"   y2="300" class="ln"/>
    <line x1="295"  y1="300" x2="100"  y2="485" class="ln"/>
    <line x1="855"  y1="300" x2="625"  y2="95"  class="ln"/>
    <line x1="855"  y1="300" x2="1085" y2="95"  class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="115" class="ln"/>
    <line x1="1415" y1="300" x2="1662" y2="300" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="485" class="ln"/>
    <polygon points="855,228 970,300 855,372 740,300" fill="#047857"/>
    <text x="855" y="306" text-anchor="middle" class="rt">BOOKS</text>
    <rect x="195" y="265" width="200" height="70" rx="3" fill="#059669"/>
    <text x="295" y="306" text-anchor="middle" class="et">GUEST</text>
    <rect x="1315" y="265" width="200" height="70" rx="3" fill="#059669"/>
    <text x="1415" y="306" text-anchor="middle" class="et">ROOM</text>
    <ellipse cx="100"  cy="100" rx="92"  ry="36" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
    <text x="100"  y="97"  text-anchor="middle" class="at" font-weight="600">GuestID</text>
    <line x1="30"   y1="108" x2="170" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="48"   cy="300" rx="78"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="48"   y="305" text-anchor="middle" class="at">Name</text>
    <ellipse cx="100"  cy="490" rx="80"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="100"  y="495" text-anchor="middle" class="at">Phone</text>
    <ellipse cx="625"  cy="78"  rx="112" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="625"  y="83"  text-anchor="middle" class="at">CheckInDate</text>
    <ellipse cx="1085" cy="78"  rx="120" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1085" y="83"  text-anchor="middle" class="at">CheckOutDate</text>
    <ellipse cx="1610" cy="100" rx="88"  ry="36" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
    <text x="1610" y="97"  text-anchor="middle" class="at" font-weight="600">RoomNo</text>
    <line x1="1546" y1="108" x2="1674" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1662" cy="300" rx="78"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1662" y="305" text-anchor="middle" class="at">Type</text>
    <ellipse cx="1610" cy="490" rx="78"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1610" y="495" text-anchor="middle" class="at">Rate</text>
    <text x="590"  y="275" text-anchor="middle" class="ct" fill="#059669">M</text>
    <text x="1120" y="275" text-anchor="middle" class="ct" fill="#059669">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`}];function gs(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),A=a.useRef(null),N=a.useRef(null),[z,M]=a.useState(.5),[S,D]=a.useState({x:0,y:0});a.useEffect(()=>{const c="era-deck-styles";if(!document.getElementById(c)){const b=document.createElement("style");b.id=c,b.textContent=fs,document.head.appendChild(b)}return()=>{document.getElementById("era-deck-styles")?.remove()}},[]),a.useEffect(()=>{const c=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",c),()=>document.removeEventListener("fullscreenchange",c)},[]),a.useEffect(()=>{const c=N.current;if(!c)return;const b=()=>{const E=c.offsetWidth,R=c.offsetHeight;if(s&&R>0){const m=Math.min(E/1920,R/1080);M(m),D({x:(E-1920*m)/2,y:(R-1080*m)/2})}else M(E/1920),D({x:0,y:0})},v=new ResizeObserver(b);return v.observe(c),b(),()=>v.disconnect()},[s]);const f=()=>{document.fullscreenElement?document.exitFullscreen():A.current?.requestFullscreen()};a.useEffect(()=>{const c=b=>{const v=b.target?.tagName;v==="INPUT"||v==="TEXTAREA"||(b.key==="ArrowRight"&&r(E=>Math.min(E+1,Ae.length-1)),b.key==="ArrowLeft"&&r(E=>Math.max(E-1,0)))};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[]);const g=Ae[t],d=Ae.length,l="#1d4ed8";return e.jsxs("div",{ref:A,style:{background:"#0f172a",borderRadius:s?0:16,overflow:"hidden",border:s?"none":"1.5px solid rgba(29,78,216,0.3)",boxShadow:s?"none":"0 8px 32px rgba(0,0,0,0.25)",...s?{display:"flex",flexDirection:"column",height:"100%"}:{}},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#F87171"}}),e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#FBBF24"}}),e.jsx("div",{style:{width:12,height:12,borderRadius:"50%",background:"#34D399"}}),e.jsxs("span",{style:{marginLeft:10,fontFamily:"DM Mono, monospace",fontSize:12,color:"rgba(255,255,255,0.35)",letterSpacing:"0.06em"},children:["MBI802 · ER Diagram Activities · ",t+1," / ",d," · ← → to navigate"]})]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[!s&&e.jsxs("button",{onClick:()=>h(c=>!c),style:{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,padding:"4px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11},children:[o?e.jsx(ie,{size:13}):e.jsx(ae,{size:13}),o?"Collapse":"Expand"]}),e.jsxs("button",{onClick:f,style:{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,padding:"4px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11},title:s?"Exit fullscreen":"Fullscreen",children:[s?e.jsx(oe,{size:13}):e.jsx(re,{size:13}),s?"Exit":"Fullscreen"]})]})]}),e.jsx("div",{ref:N,style:{position:"relative",width:"100%",...s?{flex:1}:{paddingBottom:o?"75%":"56.25%",transition:"padding-bottom 0.3s ease"},overflow:"hidden",background:"#111"},children:e.jsx("div",{style:{position:"absolute",inset:0,overflow:"hidden"},children:e.jsx("div",{className:"era",style:{width:1920,height:1080,transform:`translate(${S.x}px, ${S.y}px) scale(${z})`,transformOrigin:"top left",position:"relative"},children:e.jsx("section",{className:g.classes||void 0,style:{position:"absolute",inset:0,width:"100%",height:"100%"},dangerouslySetInnerHTML:{__html:g.html}})})})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:16,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.07)",flexShrink:0},children:[e.jsxs("button",{onClick:()=>r(c=>Math.max(c-1,0)),disabled:t===0,style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 14px",color:t===0?"rgba(255,255,255,0.2)":"#fff",cursor:t===0?"default":"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13},children:[e.jsx(le,{size:14})," Prev"]}),e.jsx("div",{style:{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"center",maxWidth:400},children:Ae.map((c,b)=>e.jsx("button",{onClick:()=>r(b),title:Ae[b].label,style:{width:b===t?20:7,height:7,borderRadius:999,background:b===t?l:"rgba(255,255,255,0.2)",border:"none",padding:0,cursor:"pointer",transition:"all 0.25s ease",flexShrink:0}},b))}),e.jsxs("button",{onClick:()=>r(c=>Math.min(c+1,d-1)),disabled:t===d-1,style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 14px",color:t===d-1?"rgba(255,255,255,0.2)":"#fff",cursor:t===d-1?"default":"pointer",display:"flex",alignItems:"center",gap:4,fontSize:13},children:["Next ",e.jsx(X,{size:14})]})]})]})}const hs=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

.erc *{box-sizing:border-box;margin:0;padding:0}
.erc{font-family:'DM Sans',sans-serif}
.erc section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.erc .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none}
.erc .cr-light{color:rgba(255,255,255,.35)}
.erc .cr-dark{color:#94a3b8}

.erc .s-title{background:#0b1728;justify-content:center;align-items:center}
.erc .s-title .inner{text-align:center}
.erc .s-title .eyebrow{font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;margin-bottom:24px;font-weight:500}
.erc .s-title h1{font-family:'Playfair Display',serif;font-size:88px;color:#f8fafc;line-height:1.05;margin-bottom:32px}
.erc .s-title .sub{font-size:26px;color:#94a3b8;font-weight:300;letter-spacing:.03em}
.erc .s-title .sub2{font-size:18px;color:#475569;margin-top:18px;letter-spacing:.05em}
.erc .s-title .deco-line{width:120px;height:3px;background:#60a5fa;margin:36px auto}

.erc .s-overview{background:#0b1728}
.erc .overview-header{padding:58px 100px 28px;text-align:center;flex-shrink:0}
.erc .overview-header .eyebrow{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#60a5fa;margin-bottom:14px;font-weight:600}
.erc .overview-header h2{font-family:'Playfair Display',serif;font-size:50px;color:#f1f5f9}
.erc .overview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;padding:0 80px 68px;flex:1}
.erc .overview-card{border-radius:16px;padding:34px 30px 30px;display:flex;flex-direction:column;background:#0d1f36;border:1px solid}
.erc .overview-card-num{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px}
.erc .overview-card h3{font-size:27px;font-weight:700;color:#f1f5f9;margin-bottom:10px;line-height:1.2}
.erc .overview-card p{font-size:18px;color:#64748b;line-height:1.65;flex:1}
.erc .overview-card .ov-symbol{margin-bottom:18px}

.erc .s-concept{background:#0d1f36}
.erc .concept-body{display:flex;flex:1;min-height:0}
.erc .concept-left{width:790px;flex-shrink:0;padding:72px 68px 72px 96px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid #1e3a5a}
.erc .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 48px;background:#091525}
.erc .concept-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px;width:fit-content}
.erc .concept-left h2{font-family:'Playfair Display',serif;font-size:54px;color:#f1f5f9;line-height:1.05;margin-bottom:20px}
.erc .concept-desc{font-size:20px;color:#94a3b8;line-height:1.75;margin-bottom:26px}
.erc .concept-desc strong{color:#e2e8f0;font-weight:600}
.erc .concept-rule{border-radius:12px;padding:20px 24px;background:#0f2744;border-left:5px solid;margin-bottom:20px}
.erc .concept-rule .rule-title{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.erc .concept-rule p{font-size:18px;color:#cbd5e1;line-height:1.65}
.erc .concept-rule strong{font-weight:700}
.erc .concept-chips{display:flex;flex-wrap:wrap;gap:10px}
.erc .concept-chip{padding:7px 16px;border-radius:8px;font-size:15px;font-weight:500;background:#0b1e35;border:1px solid}
.erc .concept-note{border-radius:10px;padding:18px 22px;margin-top:18px}
.erc .concept-note .note-label{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.erc .concept-note p{font-size:18px;line-height:1.6}
.erc .derived-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.erc .derived-item{background:#0c3b4f;border-radius:8px;padding:12px 14px}
.erc .derived-item .di-key{font-size:15px;color:#67e8f9;font-weight:600;margin-bottom:3px}
.erc .derived-item .di-val{font-size:13px;color:#475569}

.erc .s-legend{background:#0d1f36}
.erc .s-legend .leg-header{padding:46px 96px 0;flex-shrink:0}
.erc .s-legend .leg-header h2{font-family:'Playfair Display',serif;font-size:44px;color:#f1f5f9}
.erc .s-legend .leg-header p{font-size:21px;color:#64748b;margin-top:8px}

.erc .s-act{background:#fdfaf5}
.erc .s-act .act-top{display:flex;height:100%}
.erc .s-act .act-left{width:840px;flex-shrink:0;padding:66px 74px 66px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.erc .s-act .act-right{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:58px;position:relative}
.erc .act-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.erc .act-left h2{font-family:'Playfair Display',serif;font-size:44px;color:#0f172a;line-height:1.1;margin-bottom:26px}
.erc .scenario-text{font-size:20px;color:#334155;line-height:1.72;margin-bottom:26px;flex:1}
.erc .scenario-text strong{color:#0f172a;font-weight:600}
.erc .entities-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px}
.erc .entity-pill{padding:6px 18px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.03em}
.erc .task-card{border-radius:12px;padding:20px 26px;border-left:5px solid}
.erc .task-card .task-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.erc .task-card ul{list-style:none;padding:0}
.erc .task-card ul li{font-size:17px;color:#1e293b;padding:4px 0;display:flex;align-items:flex-start;gap:10px}
.erc .task-card ul li::before{content:'→';font-weight:700;flex-shrink:0;margin-top:1px}

.erc .s-ans{background:#f4f6fb}
.erc .ans-header{padding:0 90px;height:96px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #dde3f5;flex-shrink:0;background:#fff}
.erc .ans-badge{padding:7px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.erc .ans-header h2{font-family:'Playfair Display',serif;font-size:36px;color:#0f172a}
.erc .ans-header .micro-legend{margin-left:auto;display:flex;gap:22px;align-items:center}
.erc .micro-legend-item{display:flex;align-items:center;gap:8px;font-size:15px;color:#475569;font-weight:500}
.erc .ml-entity{width:34px;height:19px;background:#1e40af;border-radius:2px}
.erc .ml-weak{width:34px;height:19px;border:3px solid #1e40af;border-radius:2px;background:#1e3a8a}
.erc .ml-rel{width:19px;height:19px;background:#92400e;transform:rotate(45deg);flex-shrink:0}
.erc .ml-attr{width:38px;height:20px;border:2px solid #64748b;border-radius:50%}
.erc .ans-diagram{flex:1;display:flex;align-items:center;justify-content:center;padding:20px 60px 52px;min-height:0}
.erc .ans-diagram svg{width:100%;height:100%;display:block;overflow:visible}

.erc .et{font:700 22px 'DM Sans',sans-serif;fill:white}
.erc .rt{font:700 17px 'DM Sans',sans-serif;fill:white}
.erc .at{font:500 16px 'DM Sans',sans-serif;fill:#1e293b}
.erc .ct{font:700 26px 'DM Sans',sans-serif}
.erc .ln{stroke:#94a3b8;stroke-width:2.5;fill:none}`,Je=[{classes:"s-title",label:"01 Title",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
    <pattern id="erc-dots" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
      <circle cx="32" cy="32" r="1.5" fill="rgba(148,163,184,0.14)"/>
    </pattern>
    <rect width="1920" height="1080" fill="url(#erc-dots)"/>
    <circle cx="1760" cy="120" r="340" fill="rgba(96,165,250,0.04)"/>
    <circle cx="1800" cy="160" r="180" fill="rgba(96,165,250,0.06)"/>
    <rect x="1530" y="200" width="280" height="88" rx="5" fill="none" stroke="rgba(59,130,246,0.10)" stroke-width="3"/>
    <rect x="1544" y="214" width="252" height="60" rx="4" fill="none" stroke="rgba(59,130,246,0.07)" stroke-width="2"/>
    <polygon points="1660,520 1790,600 1660,680 1530,600" fill="none" stroke="rgba(180,83,9,0.12)" stroke-width="2.5"/>
    <polygon points="1660,538 1770,600 1660,662 1550,600" fill="none" stroke="rgba(180,83,9,0.08)" stroke-width="2"/>
    <ellipse cx="200" cy="820" rx="150" ry="58" fill="none" stroke="rgba(6,182,212,0.12)" stroke-width="2" stroke-dasharray="12,7"/>
    <ellipse cx="160" cy="220" rx="130" ry="50" fill="none" stroke="rgba(168,85,247,0.10)" stroke-width="2"/>
    <ellipse cx="160" cy="220" rx="110" ry="33" fill="none" stroke="rgba(168,85,247,0.07)" stroke-width="2"/>
    <circle cx="300" cy="960" r="260" fill="rgba(96,165,250,0.03)"/>
  </svg>
  <div class="inner">
    <p class="eyebrow">Database Management Systems</p>
    <h1>Advanced ER<br/>Concepts</h1>
    <div class="deco-line"></div>
    <p class="sub">Chen's Notation · Weak Entities · Special Attributes</p>
    <p class="sub2">Prerequisite: Basic ER Diagram knowledge</p>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-overview",label:"02 What You Will Learn",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
    <circle cx="1820" cy="80" r="320" fill="rgba(96,165,250,0.04)"/>
    <circle cx="80" cy="1000" r="240" fill="rgba(96,165,250,0.03)"/>
  </svg>
  <div class="overview-header">
    <p class="eyebrow">This lesson covers</p>
    <h2>Four New Concepts to Master</h2>
  </div>
  <div class="overview-grid">
    <div class="overview-card" style="border-color:#1e3a8a;">
      <div class="ov-symbol">
        <svg viewBox="0 0 150 74" style="width:150px;height:74px">
          <rect x="3" y="3" width="144" height="68" rx="4" fill="none" stroke="#3b82f6" stroke-width="3"/>
          <rect x="14" y="14" width="122" height="46" rx="3" fill="#1e3a8a"/>
          <text x="75" y="42" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#93c5fd" font-weight="700">ENTITY</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#3b82f6;">01 — Concept</div>
      <h3>Weak Entity</h3>
      <p>An entity that cannot be uniquely identified on its own — it depends on a stronger entity for its very existence.</p>
    </div>
    <div class="overview-card" style="border-color:#78350f;">
      <div class="ov-symbol">
        <svg viewBox="0 0 150 90" style="width:150px;height:90px">
          <polygon points="75,8 142,45 75,82 8,45" fill="none" stroke="#f59e0b" stroke-width="3"/>
          <polygon points="75,20 128,45 75,70 22,45" fill="#92400e"/>
          <text x="75" y="50" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="white" font-weight="700">REL</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#f59e0b;">02 — Concept</div>
      <h3>Identifying Relationship</h3>
      <p>The special double-diamond that links a weak entity to its owner, providing the missing identity context.</p>
    </div>
    <div class="overview-card" style="border-color:#4c1d95;">
      <div class="ov-symbol">
        <svg viewBox="0 0 180 72" style="width:180px;height:72px">
          <ellipse cx="90" cy="36" rx="86" ry="32" fill="none" stroke="#a855f7" stroke-width="2.5"/>
          <ellipse cx="90" cy="36" rx="70" ry="20" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
          <text x="90" y="41" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#d8b4fe" font-weight="600">{attribute}</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#a855f7;">03 — Concept</div>
      <h3>Multivalued Attribute</h3>
      <p>An attribute that holds multiple values for one entity — like a list of phone numbers or email addresses.</p>
    </div>
    <div class="overview-card" style="border-color:#164e63;">
      <div class="ov-symbol">
        <svg viewBox="0 0 180 72" style="width:180px;height:72px">
          <ellipse cx="90" cy="36" rx="82" ry="30" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
          <text x="90" y="41" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#67e8f9" font-style="italic">(attribute)</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#06b6d4;">04 — Concept</div>
      <h3>Derived Attribute</h3>
      <p>An attribute computed from other data — like calculating Age from DateOfBirth. Never stored directly.</p>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"03 Weak Entity",html:`<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#1e3a5a;color:#60a5fa;">Concept 01</div>
      <h2>Weak Entity</h2>
      <p class="concept-desc">
        A <strong>weak entity</strong> cannot be uniquely identified by its own attributes alone. It <strong>depends entirely on another entity</strong> — called the <em>strong entity</em> or <em>owner</em> — for both existence and identity.
      </p>
      <div class="concept-rule" style="border-color:#3b82f6;">
        <div class="rule-title" style="color:#3b82f6;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>double rectangle</strong> — two concentric boxes. The outer border signals "this entity cannot stand alone."</p>
      </div>
      <div class="concept-chips">
        <span class="concept-chip" style="color:#93c5fd;border-color:#1e3a5a;">ROOM depends on BUILDING</span>
        <span class="concept-chip" style="color:#93c5fd;border-color:#1e3a5a;">ORDER_ITEM depends on ORDER</span>
        <span class="concept-chip" style="color:#93c5fd;border-color:#1e3a5a;">DEPENDENT depends on EMPLOYEE</span>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 1010 730" style="width:100%;height:100%">
        <rect x="28" y="18" width="954" height="298" rx="12" fill="#0a1929"/>
        <text x="505" y="58" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#3b82f6" letter-spacing="3" font-weight="700">SYMBOL COMPARISON</text>
        <text x="210" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#64748b" font-weight="600">Strong Entity</text>
        <rect x="88" y="110" width="244" height="78" rx="4" fill="#1e40af"/>
        <text x="210" y="156" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="23" fill="white" font-weight="700">BUILDING</text>
        <text x="210" y="224" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#64748b">Single border</text>
        <text x="210" y="247" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Has its own primary key (PK)</text>
        <text x="210" y="268" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Can exist independently</text>
        <text x="505" y="162" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="20" fill="#1e293b" font-weight="700">vs</text>
        <text x="800" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#64748b" font-weight="600">Weak Entity</text>
        <rect x="678" y="108" width="244" height="84" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
        <rect x="691" y="121" width="218" height="58" rx="3" fill="#1e3a8a"/>
        <text x="800" y="157" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="23" fill="#93c5fd" font-weight="700">ROOM</text>
        <text x="800" y="224" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#64748b">Double border</text>
        <text x="800" y="247" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Needs BUILDING to be identified</text>
        <text x="800" y="268" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Cannot exist without its owner</text>
        <rect x="28" y="336" width="954" height="376" rx="12" fill="#0a1929"/>
        <text x="505" y="376" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#3b82f6" letter-spacing="3" font-weight="700">PARTIAL KEY (DISCRIMINATOR)</text>
        <text x="505" y="408" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#64748b">Weak entities have a partial key — unique only within their owner entity</text>
        <text x="215" y="450" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Primary Key — solid underline</text>
        <ellipse cx="215" cy="525" rx="108" ry="40" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="215" y="522" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">BuildingID</text>
        <line x1="120" y1="532" x2="310" y2="532" stroke="#93c5fd" stroke-width="2.5"/>
        <text x="215" y="600" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Uniquely identifies BUILDING</text>
        <text x="215" y="622" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">anywhere in the database</text>
        <text x="215" y="646" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">e.g. BuildingID = "B01"</text>
        <text x="505" y="533" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#1e293b" font-weight="700">vs</text>
        <text x="795" y="450" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Partial Key — dashed underline</text>
        <ellipse cx="795" cy="525" rx="96" ry="40" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="795" y="522" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">RoomNo</text>
        <line x1="710" y1="532" x2="880" y2="532" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="6,3"/>
        <text x="795" y="600" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Unique only within one BUILDING</text>
        <text x="795" y="622" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Room 101 could be in ANY building!</text>
        <text x="795" y="646" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Combined key: (BuildingID + RoomNo)</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"04 Identifying Relationship",html:`<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#431407;color:#fbbf24;">Concept 02</div>
      <h2>Identifying Relationship</h2>
      <p class="concept-desc">
        The <strong>special relationship</strong> connecting a weak entity to its owner. It provides the ownership context needed to uniquely identify each weak entity instance.
      </p>
      <div class="concept-rule" style="border-color:#f59e0b;">
        <div class="rule-title" style="color:#f59e0b;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>double diamond</strong> — two concentric diamonds. It <strong>always</strong> connects a weak entity to its strong entity.</p>
      </div>
      <div class="concept-note" style="background:#1a0d00;">
        <div class="note-label" style="color:#fbbf24;">Remember</div>
        <p style="color:#d97706;font-size:18px;line-height:1.6;">If you draw a double diamond, one side <em>must</em> be a weak entity (double rectangle). They always appear together.</p>
      </div>
      <div class="concept-chips" style="margin-top:18px;">
        <span class="concept-chip" style="color:#fbbf24;border-color:#431407;">Cardinality: 1 (strong) to N (weak)</span>
        <span class="concept-chip" style="color:#fbbf24;border-color:#431407;">Weak side: total participation</span>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 1100 590" style="width:100%;height:100%">
        <line x1="380" y1="282" x2="449" y2="282" stroke="#334155" stroke-width="2.5"/>
        <line x1="693" y1="282" x2="754" y2="282" stroke="#334155" stroke-width="2.5"/>
        <line x1="283" y1="247" x2="156" y2="120" stroke="#334155" stroke-width="2.5"/>
        <line x1="182" y1="282" x2="84" y2="282" stroke="#334155" stroke-width="2.5"/>
        <line x1="872" y1="247" x2="998" y2="120" stroke="#334155" stroke-width="2.5"/>
        <line x1="954" y1="282" x2="1050" y2="282" stroke="#334155" stroke-width="2.5"/>
        <rect x="182" y="247" width="198" height="70" rx="4" fill="#1e40af"/>
        <text x="281" y="288" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="white" font-weight="700">BUILDING</text>
        <polygon points="571,210 693,282 571,354 449,282" fill="none" stroke="#b45309" stroke-width="3.5"/>
        <polygon points="571,222 678,282 571,342 464,282" fill="#92400e"/>
        <text x="571" y="288" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="white" font-weight="700">has</text>
        <rect x="754" y="244" width="198" height="76" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
        <rect x="767" y="257" width="172" height="50" rx="3" fill="#1e3a8a"/>
        <text x="853" y="288" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#93c5fd" font-weight="700">ROOM</text>
        <ellipse cx="143" cy="100" rx="100" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="143" y="97" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">BuildingID</text>
        <line x1="57" y1="107" x2="229" y2="107" stroke="#93c5fd" stroke-width="2"/>
        <ellipse cx="64" cy="282" rx="68" ry="30" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="64" y="287" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Name</text>
        <ellipse cx="1006" cy="100" rx="88" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="1006" y="97" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">RoomNo</text>
        <line x1="930" y1="107" x2="1082" y2="107" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6,3"/>
        <ellipse cx="1072" cy="282" rx="74" ry="30" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="1072" y="287" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">RoomType</text>
        <text x="427" y="260" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="26" fill="#f59e0b" font-weight="700">1</text>
        <text x="717" y="260" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="26" fill="#f59e0b" font-weight="700">N</text>
        <text x="281" y="358" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Strong Entity</text>
        <text x="571" y="402" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b">Identifying</text>
        <text x="571" y="420" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b">Relationship</text>
        <text x="853" y="374" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#60a5fa">Weak Entity</text>
        <line x1="900" y1="120" x2="970" y2="145" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="965" y="138" width="128" height="38" rx="6" fill="#0f2744" stroke="#1e3a5a" stroke-width="1.5"/>
        <text x="1029" y="155" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#60a5fa">Dashed underline</text>
        <text x="1029" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">= Partial key</text>
        <rect x="60" y="470" width="980" height="96" rx="8" fill="#1a0d00"/>
        <text x="550" y="507" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#f59e0b" font-weight="700">KEY INSIGHT</text>
        <text x="550" y="531" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#92400e">One BUILDING "owns" many ROOMs. RoomNo 101 only makes sense per building.</text>
        <text x="550" y="553" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#78350f">The combined (composite) key is:  BuildingID + RoomNo</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"05 Multivalued Attribute",html:`<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#2e1065;color:#d8b4fe;">Concept 03</div>
      <h2>Multivalued Attribute</h2>
      <p class="concept-desc">
        A <strong>multivalued attribute</strong> can hold <strong>more than one value</strong> for a single entity instance. Rather than one phone number per employee, you can store many.
      </p>
      <div class="concept-rule" style="border-color:#a855f7;">
        <div class="rule-title" style="color:#a855f7;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>double ellipse</strong> — two concentric ovals. In text notation, written with curly braces: <strong>{PhoneNumbers}</strong>.</p>
      </div>
      <div class="concept-chips">
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{PhoneNumbers}</span>
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{EmailAddresses}</span>
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{Skills}</span>
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{Languages}</span>
      </div>
      <div class="concept-note" style="background:#1a0533;margin-top:18px;">
        <div class="note-label" style="color:#a855f7;">Why not just add 3 phone attributes?</div>
        <p style="color:#7e22ce;font-size:17px;line-height:1.6;">Because we don't know in advance how many values a given instance will have. Double ellipse = flexible, open-ended list.</p>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 940 640" style="width:100%;height:100%">
        <line x1="443" y1="270" x2="268" y2="137" stroke="#334155" stroke-width="2.5"/>
        <line x1="355" y1="308" x2="104" y2="308" stroke="#334155" stroke-width="2.5"/>
        <line x1="443" y1="346" x2="268" y2="479" stroke="#334155" stroke-width="2.5"/>
        <line x1="531" y1="270" x2="690" y2="137" stroke="#a855f7" stroke-width="2.5"/>
        <rect x="355" y="273" width="176" height="70" rx="3" fill="#1e40af"/>
        <text x="443" y="314" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="20" fill="white" font-weight="700">EMPLOYEE</text>
        <ellipse cx="228" cy="110" rx="90" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="228" y="107" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">EmpID</text>
        <line x1="152" y1="116" x2="304" y2="116" stroke="#93c5fd" stroke-width="2"/>
        <ellipse cx="58" cy="308" rx="62" ry="30" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="58" y="313" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Name</text>
        <ellipse cx="228" cy="490" rx="92" ry="34" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="228" y="495" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Department</text>
        <ellipse cx="690" cy="110" rx="136" ry="50" fill="rgba(168,85,247,0.07)"/>
        <ellipse cx="690" cy="110" rx="122" ry="42" fill="none" stroke="#a855f7" stroke-width="2.5"/>
        <ellipse cx="690" cy="110" rx="105" ry="28" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
        <text x="690" y="115" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#d8b4fe" font-weight="600">PhoneNumbers</text>
        <line x1="812" y1="100" x2="858" y2="88" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="854" y="64" width="78" height="48" rx="6" fill="#1a0533" stroke="#7e22ce" stroke-width="1.5"/>
        <text x="893" y="85" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#c4b5fd">Double</text>
        <text x="893" y="102" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#c4b5fd">ellipse</text>
        <rect x="540" y="190" width="370" height="130" rx="10" fill="#1a0533"/>
        <text x="725" y="218" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a855f7" font-weight="700" letter-spacing="1">EXAMPLE: ONE EMPLOYEE'S PHONES</text>
        <rect x="558" y="228" width="334" height="24" rx="4" fill="#2e1065"/>
        <text x="725" y="244" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e9d5ff">021 123 4567</text>
        <rect x="558" y="258" width="334" height="24" rx="4" fill="#2e1065"/>
        <text x="725" y="274" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e9d5ff">09 876 5432</text>
        <rect x="558" y="288" width="334" height="24" rx="4" fill="#2e1065"/>
        <text x="725" y="304" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e9d5ff">027 111 2233</text>
        <rect x="30" y="548" width="880" height="68" rx="8" fill="#0a1929"/>
        <text x="470" y="578" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#a855f7" font-weight="700">In a relational database, multivalued attrs become their own table</text>
        <text x="470" y="600" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">e.g.  EMPLOYEE_PHONE (EmpID, PhoneNumber)</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"06 Derived Attribute",html:`<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#083344;color:#67e8f9;">Concept 04</div>
      <h2>Derived Attribute</h2>
      <p class="concept-desc">
        A <strong>derived attribute</strong> is <strong>calculated from other stored data</strong> — it doesn't need to be saved in the database because you can always compute it on demand.
      </p>
      <div class="concept-rule" style="border-color:#06b6d4;">
        <div class="rule-title" style="color:#06b6d4;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>dashed ellipse</strong> — the broken border signals "this value isn't stored directly." In text: written as <strong>(Age)</strong> with parentheses.</p>
      </div>
      <div class="concept-chips">
        <span class="concept-chip" style="color:#67e8f9;border-color:#083344;">(Age) from DateOfBirth</span>
        <span class="concept-chip" style="color:#67e8f9;border-color:#083344;">(TotalPrice) from UnitPrice × Qty</span>
        <span class="concept-chip" style="color:#67e8f9;border-color:#083344;">(YearsOfService) from HireDate</span>
      </div>
      <div class="concept-note" style="background:#041b24;margin-top:18px;">
        <div class="note-label" style="color:#06b6d4;">Why not just store it?</div>
        <p style="color:#0e7490;font-size:17px;line-height:1.6;">Storing derived data risks <strong style="color:#67e8f9;">inconsistency</strong>. If DateOfBirth changes, a stored Age becomes wrong. Compute it instead — always accurate.</p>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 940 640" style="width:100%;height:100%">
        <line x1="400" y1="275" x2="215" y2="128" stroke="#334155" stroke-width="2.5"/>
        <line x1="325" y1="310" x2="84" y2="310" stroke="#334155" stroke-width="2.5"/>
        <line x1="400" y1="345" x2="215" y2="490" stroke="#334155" stroke-width="2.5"/>
        <line x1="475" y1="275" x2="650" y2="128" stroke="#06b6d4" stroke-width="2.5"/>
        <line x1="540" y1="310" x2="720" y2="310" stroke="#334155" stroke-width="2.5"/>
        <rect x="325" y="275" width="215" height="70" rx="3" fill="#1e40af"/>
        <text x="432" y="316" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="21" fill="white" font-weight="700">PERSON</text>
        <ellipse cx="175" cy="106" rx="98" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="175" y="103" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">PersonID</text>
        <line x1="90" y1="113" x2="260" y2="113" stroke="#93c5fd" stroke-width="2"/>
        <ellipse cx="55" cy="310" rx="56" ry="28" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="55" y="315" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Name</text>
        <ellipse cx="180" cy="492" rx="102" ry="36" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="180" y="497" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#475569">DateOfBirth</text>
        <ellipse cx="660" cy="108" rx="110" ry="44" fill="rgba(6,182,212,0.05)"/>
        <ellipse cx="660" cy="108" rx="96" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
        <text x="660" y="113" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#67e8f9" font-style="italic">Age</text>
        <line x1="756" y1="94" x2="800" y2="78" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="796" y="54" width="100" height="52" rx="6" fill="#041b24" stroke="#0e7490" stroke-width="1.5"/>
        <text x="846" y="76" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#67e8f9">Dashed ellipse</text>
        <text x="846" y="93" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#475569">= Not stored</text>
        <ellipse cx="752" cy="310" rx="72" ry="28" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="752" y="315" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Email</text>
        <rect x="180" y="390" width="590" height="130" rx="10" fill="#041b24"/>
        <text x="475" y="419" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#06b6d4" font-weight="700" letter-spacing="1">HOW AGE IS DERIVED</text>
        <rect x="200" y="428" width="160" height="46" rx="6" fill="#0e7490"/>
        <text x="280" y="447" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#e0f2fe">DateOfBirth</text>
        <text x="280" y="464" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#7dd3fc">1990-05-14 ✓ stored</text>
        <text x="400" y="456" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#334155">→</text>
        <rect x="420" y="428" width="150" height="46" rx="6" fill="#0c4a6e"/>
        <text x="495" y="447" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#e0f2fe">Today − DOB</text>
        <text x="495" y="464" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#7dd3fc">SQL: DATEDIFF()</text>
        <text x="610" y="456" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#334155">→</text>
        <rect x="630" y="428" width="120" height="46" rx="6" fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6,3"/>
        <text x="690" y="447" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#67e8f9">Age</text>
        <text x="690" y="465" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#0e7490">34 ✗ not stored</text>
        <rect x="30" y="556" width="880" height="58" rx="8" fill="#0a1929"/>
        <text x="470" y="580" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#06b6d4" font-weight="700">Dashed ellipse = "I can compute this — no need to store it"</text>
        <text x="470" y="602" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Always stays accurate — automatically reflects the latest data</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-legend",label:"07 Symbol Reference",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
    <circle cx="1800" cy="900" r="400" fill="rgba(96,165,250,0.03)"/>
  </svg>
  <div class="leg-header">
    <h2>Advanced Symbol Reference — Quick Guide</h2>
    <p>All four new symbols at a glance. Use this slide as your reference.</p>
  </div>
  <svg viewBox="0 0 1720 820" style="width:100%;flex:1;padding:0 40px">
    <g transform="translate(200,160)">
      <rect x="-105" y="-40" width="210" height="80" rx="4" fill="#1e40af"/>
      <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="21" fill="white" font-weight="700">ENTITY</text>
      <text x="0" y="72" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Strong Entity</text>
      <text x="0" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Single rectangle</text>
      <text x="0" y="116" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Has its own primary key</text>
    </g>
    <g transform="translate(640,160)">
      <rect x="-105" y="-46" width="210" height="92" rx="5" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
      <rect x="-90" y="-32" width="180" height="64" rx="3" fill="#1e3a8a"/>
      <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="21" fill="#93c5fd" font-weight="700">ENTITY</text>
      <text x="0" y="78" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Weak Entity</text>
      <text x="0" y="102" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Double rectangle</text>
      <text x="0" y="122" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Depends on strong entity</text>
    </g>
    <g transform="translate(1080,160)">
      <polygon points="0,-60 120,0 0,60 -120,0" fill="#92400e"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="18" fill="white" font-weight="700">REL</text>
      <text x="0" y="84" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Relationship</text>
      <text x="0" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Single diamond</text>
      <text x="0" y="128" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Between regular entities</text>
    </g>
    <g transform="translate(1530,160)">
      <polygon points="0,-66 128,0 0,66 -128,0" fill="none" stroke="#f59e0b" stroke-width="3.5"/>
      <polygon points="0,-50 106,0 0,50 -106,0" fill="#92400e"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="15" fill="white" font-weight="700">REL</text>
      <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Identifying Rel.</text>
      <text x="0" y="114" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Double diamond</text>
      <text x="0" y="134" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Links weak entity to owner</text>
    </g>
    <line x1="80" y1="360" x2="1640" y2="360" stroke="#1e3a5a" stroke-width="1.5"/>
    <g transform="translate(200,520)">
      <ellipse rx="105" ry="44" fill="none" stroke="#475569" stroke-width="2.5"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="17" fill="#94a3b8">attribute</text>
      <text x="0" y="70" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Attribute</text>
      <text x="0" y="94" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Single ellipse</text>
      <text x="0" y="114" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">One value per entity</text>
    </g>
    <g transform="translate(640,520)">
      <ellipse rx="105" ry="44" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
      <text text-anchor="middle" dy="2" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">attribute</text>
      <line x1="-54" y1="10" x2="54" y2="10" stroke="#93c5fd" stroke-width="2"/>
      <text x="0" y="70" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Key Attribute</text>
      <text x="0" y="94" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Solid underline = Primary Key</text>
      <text x="0" y="114" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Uniquely identifies entity</text>
    </g>
    <g transform="translate(1080,520)">
      <ellipse rx="108" ry="50" fill="rgba(168,85,247,0.05)"/>
      <ellipse rx="94" ry="42" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <ellipse rx="78" ry="28" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="14" fill="#d8b4fe">{attribute}</text>
      <text x="0" y="74" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Multivalued</text>
      <text x="0" y="98" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Double ellipse — {curly braces}</text>
      <text x="0" y="118" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Multiple values per entity</text>
    </g>
    <g transform="translate(1530,520)">
      <ellipse rx="108" ry="44" fill="rgba(6,182,212,0.04)"/>
      <ellipse rx="94" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="17" fill="#67e8f9" font-style="italic">(attribute)</text>
      <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Derived Attribute</text>
      <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Dashed ellipse — (parentheses)</text>
      <text x="0" y="110" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Calculated, never stored</text>
    </g>
    <g transform="translate(640,720)">
      <ellipse rx="105" ry="40" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
      <text text-anchor="middle" dy="2" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">partialKey</text>
      <line x1="-54" y1="10" x2="54" y2="10" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="0" y="60" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e2e8f0" font-weight="600">Partial Key</text>
      <text x="0" y="80" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">Dashed underline — belongs to weak entity</text>
    </g>
  </svg>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"08 Exercise 1 Scenario",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.35" viewBox="0 0 1920 1080">
    <circle cx="1700" cy="540" r="500" fill="none" stroke="#fde68a" stroke-width="1"/>
    <circle cx="1700" cy="540" r="330" fill="none" stroke="#fde68a" stroke-width="1"/>
    <circle cx="1700" cy="540" r="160" fill="none" stroke="#fde68a" stroke-width="1"/>
  </svg>
  <div class="act-top">
    <div class="act-left">
      <div class="act-badge" style="background:#fef3c7;color:#92400e;">Exercise 01</div>
      <h2>University Building &amp; Rooms</h2>
      <p class="scenario-text">
        A <strong>university</strong> manages its campus facilities. Each <strong>building</strong> has a building ID, name, and location. Each building has many <strong>rooms</strong>, but a room number (like "101") only makes sense within a specific building — Room 101 could exist in <em>every</em> building.<br/><br/>
        Each room has a room number and a room type (lecture hall, lab, office). A room <strong>cannot exist</strong> without its building. Additionally, each room has a <strong>seating capacity</strong> and a <em>utilisation rate</em> which is <strong>automatically calculated</strong> from bookings data. Buildings can have <strong>multiple contact phone numbers</strong> on record.
      </p>
      <div class="entities-row">
        <span class="entity-pill" style="background:#dbeafe;color:#1e40af;">BUILDING (strong)</span>
        <span class="entity-pill" style="background:#1e3a8a;color:#93c5fd;">ROOM (weak)</span>
        <span class="entity-pill" style="background:#fef3c7;color:#92400e;">HAS (identifying)</span>
      </div>
      <div class="task-card" style="background:#fffbeb;border-color:#d97706;">
        <div class="task-title" style="color:#d97706;">Your Task</div>
        <ul>
          <li>Draw BUILDING as a strong entity with its key attribute</li>
          <li>Draw ROOM as a weak entity with its partial key (RoomNo)</li>
          <li>Connect them with an identifying relationship (double diamond)</li>
          <li>Show PhoneNumbers as a multivalued attribute on BUILDING</li>
          <li>Show UtilisationRate as a derived attribute on ROOM</li>
        </ul>
      </div>
    </div>
    <div class="act-right">
      <svg viewBox="0 0 400 380" style="width:360px;height:auto;">
        <rect x="10" y="330" width="380" height="16" rx="4" fill="#d1c4a8"/>
        <rect x="60" y="120" width="280" height="210" rx="4" fill="#1e40af"/>
        <polygon points="40,120 200,40 360,120" fill="#1e3a8a"/>
        <rect x="88"  y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="148" y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="208" y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="268" y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="88"  y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="148" y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="208" y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="268" y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="88"  y="260" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="268" y="260" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="168" y="268" width="64" height="62" rx="4" fill="#0b1728"/>
        <circle cx="224" cy="300" r="4" fill="#fbbf24"/>
        <rect x="110" y="68" width="180" height="28" rx="4" fill="#0b1728"/>
        <text x="200" y="87" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#60a5fa" font-weight="700" letter-spacing="2">BUILDING A</text>
        <text x="110" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">101</text>
        <text x="170" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">102</text>
        <text x="230" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">103</text>
        <text x="290" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">104</text>
        <text x="200" y="360" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#94a3b8">Room 101 exists in EVERY building!</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"09 Answer 1 Building Rooms",html:`<div class="ans-header">
    <span class="ans-badge" style="background:#fef3c7;color:#92400e;">Answer 01</span>
    <h2>University Building &amp; Rooms</h2>
    <div class="micro-legend">
      <div class="micro-legend-item"><div class="ml-entity"></div> Strong Entity</div>
      <div class="micro-legend-item"><div class="ml-weak"></div> Weak Entity</div>
      <div class="micro-legend-item"><div class="ml-rel"></div> Identifying Rel.</div>
      <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
    </div>
  </div>
  <div class="ans-diagram">
    <svg viewBox="0 0 1720 640" preserveAspectRatio="xMidYMid meet">
      <line x1="390" y1="310" x2="522" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="698" y1="310" x2="810" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="290" y1="275" x2="170" y2="130" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="190" y1="310" x2="52" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="290" y1="345" x2="170" y2="490" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="210" y1="322" x2="90" y2="420" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="910" y1="275" x2="1030" y2="130" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="1010" y1="310" x2="1148" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="910" y1="345" x2="1030" y2="490" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="1010" y1="270" x2="1160" y2="168" stroke="#94a3b8" stroke-width="2.5"/>
      <rect x="190" y="275" width="200" height="70" rx="3" fill="#1e40af"/>
      <text x="290" y="316" text-anchor="middle" class="et">BUILDING</text>
      <polygon points="610,238 698,310 610,382 522,310" fill="none" stroke="#b45309" stroke-width="3.5"/>
      <polygon points="610,250 686,310 610,370 534,310" fill="#92400e"/>
      <text x="610" y="316" text-anchor="middle" class="rt">has</text>
      <rect x="808" y="271" width="204" height="78" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
      <rect x="821" y="283" width="178" height="54" rx="3" fill="#1e3a8a"/>
      <text x="910" y="316" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="21" fill="#93c5fd" font-weight="700">ROOM</text>
      <ellipse cx="148" cy="110" rx="104" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
      <text x="148" y="107" text-anchor="middle" class="at" font-weight="600">BuildingID</text>
      <line x1="56" y1="117" x2="240" y2="117" stroke="#1e293b" stroke-width="2"/>
      <ellipse cx="42" cy="310" rx="62" ry="44" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <ellipse cx="42" cy="310" rx="48" ry="31" fill="#2e1065" stroke="#a855f7" stroke-width="1.8"/>
      <text x="42" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#d8b4fe" font-weight="600">{Phone</text>
      <text x="42" y="320" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#d8b4fe" font-weight="600">Numbers}</text>
      <ellipse cx="148" cy="490" rx="84" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="148" y="495" text-anchor="middle" class="at">Name</text>
      <ellipse cx="78" cy="420" rx="76" ry="30" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="78" y="425" text-anchor="middle" class="at">Location</text>
      <ellipse cx="1060" cy="110" rx="98" ry="36" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
      <text x="1060" y="107" text-anchor="middle" class="at" font-weight="600">RoomNo</text>
      <line x1="972" y1="117" x2="1148" y2="117" stroke="#1e293b" stroke-width="2" stroke-dasharray="6,3"/>
      <ellipse cx="1196" cy="310" rx="108" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
      <text x="1196" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">(Utilisation</text>
      <text x="1196" y="322" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">Rate)</text>
      <ellipse cx="1060" cy="490" rx="86" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="1060" y="495" text-anchor="middle" class="at">Capacity</text>
      <ellipse cx="1178" cy="168" rx="84" ry="30" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="1178" y="173" text-anchor="middle" class="at">RoomType</text>
      <text x="496" y="288" text-anchor="middle" class="ct" fill="#d97706">1</text>
      <text x="724" y="288" text-anchor="middle" class="ct" fill="#d97706">N</text>
      <rect x="1360" y="90" width="330" height="68" rx="8" fill="#1a0533"/>
      <text x="1525" y="116" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#a855f7" font-weight="700">Double ellipse = Multivalued</text>
      <text x="1525" y="138" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">{PhoneNumbers} → multiple values</text>
      <rect x="1360" y="185" width="330" height="68" rx="8" fill="#041b24"/>
      <text x="1525" y="211" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#06b6d4" font-weight="700">Dashed ellipse = Derived</text>
      <text x="1525" y="233" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">(UtilisationRate) → computed</text>
      <rect x="1360" y="280" width="330" height="68" rx="8" fill="#0a1929"/>
      <text x="1525" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#3b82f6" font-weight="700">Dashed underline = Partial Key</text>
      <text x="1525" y="328" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">RoomNo unique only per building</text>
      <rect x="1360" y="375" width="330" height="68" rx="8" fill="#1a0d00"/>
      <text x="1525" y="401" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b" font-weight="700">Double diamond = Identifying Rel.</text>
      <text x="1525" y="423" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">HAS links weak ROOM to BUILDING</text>
    </svg>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"10 Exercise 2 Scenario",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
    <circle cx="1700" cy="540" r="480" fill="none" stroke="#a7f3d0" stroke-width="1"/>
    <circle cx="1700" cy="540" r="300" fill="none" stroke="#a7f3d0" stroke-width="1"/>
  </svg>
  <div class="act-top">
    <div class="act-left">
      <div class="act-badge" style="background:#d1fae5;color:#065f46;">Exercise 02</div>
      <h2>Employee &amp; Dependants</h2>
      <p class="scenario-text">
        A company tracks its <strong>employees</strong> and their <strong>dependants</strong> (family members covered by insurance). Each employee has an employee ID, name, hire date, and date of birth. A <strong>dependant</strong> has only a name and relationship (e.g. "spouse", "child") — and <strong>cannot exist in the system without their employee</strong>. A dependant named "Emma" only makes sense in the context of a specific employee.<br/><br/>
        Employees may speak <strong>multiple languages</strong>. The company also needs to display each employee's <em>years of service</em> on their profile — but this should <strong>never be stored</strong> directly in the database.
      </p>
      <div class="entities-row">
        <span class="entity-pill" style="background:#d1fae5;color:#065f46;">EMPLOYEE (strong)</span>
        <span class="entity-pill" style="background:#064e3b;color:#6ee7b7;">DEPENDANT (weak)</span>
        <span class="entity-pill" style="background:#fef3c7;color:#92400e;">HAS_DEPENDANT (identifying)</span>
      </div>
      <div class="task-card" style="background:#ecfdf5;border-color:#059669;">
        <div class="task-title" style="color:#059669;">Your Task</div>
        <ul>
          <li>Identify and draw EMPLOYEE as a strong entity with EmpID as key</li>
          <li>Draw DEPENDANT as a weak entity; DepName is the partial key</li>
          <li>Connect them with HAS_DEPENDANT as an identifying relationship</li>
          <li>Add Languages as a multivalued attribute on EMPLOYEE</li>
          <li>Add YearsOfService as a derived attribute on EMPLOYEE</li>
        </ul>
      </div>
    </div>
    <div class="act-right">
      <svg viewBox="0 0 400 380" style="width:340px;height:auto;">
        <rect x="10" y="340" width="380" height="14" rx="4" fill="#d1c4a8"/>
        <circle cx="180" cy="80" r="38" fill="#059669"/>
        <text x="180" y="87" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="white" font-weight="700">EMP</text>
        <rect x="148" y="124" width="64" height="88" rx="8" fill="#065f46"/>
        <rect x="96" y="132" width="52" height="14" rx="6" fill="#065f46"/>
        <rect x="212" y="132" width="52" height="14" rx="6" fill="#065f46"/>
        <rect x="155" y="212" width="22" height="64" rx="6" fill="#064e3b"/>
        <rect x="183" y="212" width="22" height="64" rx="6" fill="#064e3b"/>
        <rect x="160" y="138" width="40" height="28" rx="3" fill="#a7f3d0"/>
        <text x="180" y="158" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#065f46" font-weight="700">ID CARD</text>
        <circle cx="72" cy="200" r="26" fill="#34d399"/>
        <text x="72" y="207" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="white" font-weight="700">DEP</text>
        <rect x="56" y="230" width="32" height="50" rx="6" fill="#6ee7b7"/>
        <line x1="144" y1="175" x2="96" y2="205" stroke="#6ee7b7" stroke-width="3"/>
        <circle cx="290" cy="200" r="26" fill="#34d399"/>
        <text x="290" y="207" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="white" font-weight="700">DEP</text>
        <rect x="274" y="230" width="32" height="50" rx="6" fill="#6ee7b7"/>
        <line x1="218" y1="175" x2="268" y2="205" stroke="#6ee7b7" stroke-width="3"/>
        <text x="72" y="296" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Emma (child)</text>
        <text x="290" y="296" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">James (spouse)</text>
        <text x="180" y="310" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#059669" font-weight="600">Sarah Chen — Emp #E042</text>
        <text x="180" y="362" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#94a3b8">"Emma" is meaningless without Sarah!</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"11 Answer 2 Employee Dependants",html:`<div class="ans-header">
    <span class="ans-badge" style="background:#d1fae5;color:#065f46;">Answer 02</span>
    <h2>Employee &amp; Dependants</h2>
    <div class="micro-legend">
      <div class="micro-legend-item"><div class="ml-entity"></div> Strong Entity</div>
      <div class="micro-legend-item"><div class="ml-weak"></div> Weak Entity</div>
      <div class="micro-legend-item"><div class="ml-rel"></div> Identifying Rel.</div>
      <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
    </div>
  </div>
  <div class="ans-diagram">
    <svg viewBox="0 0 1720 640" preserveAspectRatio="xMidYMid meet">
      <line x1="410" y1="300" x2="520" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="700" y1="300" x2="810" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="310" y1="265" x2="158" y2="108" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="210" y1="300" x2="52" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="310" y1="335" x2="182" y2="492" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="310" y1="260" x2="78" y2="168" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="410" y1="270" x2="488" y2="120" stroke="#06b6d4" stroke-width="2.5"/>
      <line x1="910" y1="268" x2="1050" y2="108" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="1010" y1="300" x2="1158" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <rect x="210" y="265" width="200" height="70" rx="3" fill="#059669"/>
      <text x="310" y="306" text-anchor="middle" class="et">EMPLOYEE</text>
      <polygon points="610,232 700,300 610,368 520,300" fill="none" stroke="#b45309" stroke-width="3.5"/>
      <polygon points="610,244 688,300 610,356 532,300" fill="#92400e"/>
      <text x="610" y="295" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="white" font-weight="700">has_</text>
      <text x="610" y="312" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="white" font-weight="700">dept</text>
      <rect x="808" y="261" width="204" height="78" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
      <rect x="820" y="272" width="180" height="56" rx="3" fill="#064e3b"/>
      <text x="910" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="19" fill="#6ee7b7" font-weight="700">DEPENDANT</text>
      <ellipse cx="133" cy="86" rx="100" ry="36" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
      <text x="133" y="83" text-anchor="middle" class="at" font-weight="600">EmpID</text>
      <line x1="46" y1="92" x2="220" y2="92" stroke="#1e293b" stroke-width="2"/>
      <ellipse cx="38" cy="300" rx="52" ry="42" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <ellipse cx="38" cy="300" rx="40" ry="28" fill="#2e1065" stroke="#a855f7" stroke-width="1.8"/>
      <text x="38" y="296" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#d8b4fe" font-weight="600">{Lang-</text>
      <text x="38" y="310" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#d8b4fe" font-weight="600">uages}</text>
      <ellipse cx="153" cy="492" rx="96" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="153" y="497" text-anchor="middle" class="at">HireDate</text>
      <ellipse cx="56" cy="168" rx="66" ry="28" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="56" y="173" text-anchor="middle" class="at">Name</text>
      <ellipse cx="500" cy="100" rx="108" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
      <text x="500" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">(YearsOf</text>
      <text x="500" y="112" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">Service)</text>
      <ellipse cx="1066" cy="86" rx="100" ry="36" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
      <text x="1066" y="83" text-anchor="middle" class="at" font-weight="600">DepName</text>
      <line x1="978" y1="92" x2="1154" y2="92" stroke="#1e293b" stroke-width="2" stroke-dasharray="6,3"/>
      <ellipse cx="1196" cy="300" rx="100" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="1196" y="305" text-anchor="middle" class="at">Relationship</text>
      <text x="496" y="278" text-anchor="middle" class="ct" fill="#059669">1</text>
      <text x="726" y="278" text-anchor="middle" class="ct" fill="#059669">N</text>
      <rect x="1350" y="60" width="340" height="66" rx="8" fill="#2e1065"/>
      <text x="1520" y="85" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#d8b4fe" font-weight="700">{Languages} — Multivalued</text>
      <text x="1520" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#7e22ce">Many languages per employee</text>
      <rect x="1350" y="148" width="340" height="66" rx="8" fill="#041b24"/>
      <text x="1520" y="173" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#67e8f9" font-weight="700">(YearsOfService) — Derived</text>
      <text x="1520" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#0e7490">Computed from HireDate</text>
      <rect x="1350" y="236" width="340" height="66" rx="8" fill="#0a1929"/>
      <text x="1520" y="261" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#60a5fa" font-weight="700">DepName — Partial Key</text>
      <text x="1520" y="284" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Unique only per employee</text>
      <rect x="1350" y="324" width="340" height="66" rx="8" fill="#1a0d00"/>
      <text x="1520" y="349" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b" font-weight="700">HAS_DEPT — Identifying Rel.</text>
      <text x="1520" y="372" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#78350f">DEPENDANT cannot exist alone</text>
      <rect x="1350" y="412" width="340" height="66" rx="8" fill="#0d1f36"/>
      <text x="1520" y="437" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#3b82f6" font-weight="700">DEPENDANT — Weak Entity</text>
      <text x="1520" y="460" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Double rectangle — depends on EMPLOYEE</text>
    </svg>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`}];function ms(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),A=a.useRef(null),N=a.useRef(null),z=Je.length;a.useEffect(()=>{const f="erc-deck-styles";if(!document.getElementById(f)){const g=document.createElement("style");g.id=f,g.textContent=hs,document.head.appendChild(g)}return()=>{const g=document.getElementById(f);g&&g.remove()}},[]),a.useEffect(()=>{const f=A.current,g=N.current;if(!f||!g)return;const d=new ResizeObserver(()=>{const{width:l,height:c}=f.getBoundingClientRect(),b=Math.min(l/1920,c/1080);g.style.transform=`scale(${b})`,g.style.transformOrigin="top left",f.style.height=`${1080*b}px`});return d.observe(f),()=>d.disconnect()},[]),a.useEffect(()=>{const f=g=>{(g.key==="ArrowRight"||g.key==="ArrowDown")&&r(d=>Math.min(d+1,z-1)),(g.key==="ArrowLeft"||g.key==="ArrowUp")&&r(d=>Math.max(d-1,0)),g.key==="Escape"&&s&&S()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[s,z]),a.useEffect(()=>{const f=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",f),()=>document.removeEventListener("fullscreenchange",f)},[]);function M(){A.current?.requestFullscreen?.()}function S(){document.exitFullscreen?.()}const D=Je[t];return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r(f=>Math.max(f-1,0)),disabled:t===0,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(96,165,250,0.3)"},children:e.jsx(le,{size:18})}),e.jsxs("span",{className:"text-sm font-medium text-gray-600 min-w-[80px] text-center",children:[t+1," / ",z]}),e.jsx("button",{onClick:()=>r(f=>Math.min(f+1,z-1)),disabled:t===z-1,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(96,165,250,0.3)"},children:e.jsx(X,{size:18})})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400 hidden sm:block",children:D.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>h(f=>!f),className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(96,165,250,0.3)"},title:o?"Collapse":"Expand",children:o?e.jsx(ie,{size:16}):e.jsx(ae,{size:16})}),e.jsx("button",{onClick:s?S:M,className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(96,165,250,0.3)"},title:s?"Exit fullscreen":"Fullscreen",children:s?e.jsx(oe,{size:16}):e.jsx(re,{size:16})})]})]}),e.jsx("div",{ref:A,className:"erc relative w-full overflow-hidden rounded-xl",style:{border:"1px solid rgba(96,165,250,0.3)"},children:e.jsx("div",{ref:N,style:{width:1920,height:1080},children:e.jsx("section",{className:D.classes,dangerouslySetInnerHTML:{__html:D.html}})})}),e.jsx("div",{className:`flex flex-wrap justify-center gap-1.5 ${o?"mt-2":""}`,children:Je.map((f,g)=>e.jsx("button",{onClick:()=>r(g),title:f.label,className:"rounded-full transition-all",style:{width:g===t?24:8,height:8,background:g===t?"#60a5fa":"rgba(96,165,250,0.25)"}},g))})]})}const ys=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

@keyframes ecpFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes ecpFadeIn { from { opacity:0; } to { opacity:1; } }
.ecp .a1 { animation: ecpFadeUp 0.5s ease forwards; }
.ecp .a2 { animation: ecpFadeUp 0.5s 0.15s ease forwards; opacity:0; }
.ecp .a3 { animation: ecpFadeUp 0.5s 0.30s ease forwards; opacity:0; }
.ecp .a4 { animation: ecpFadeUp 0.5s 0.45s ease forwards; opacity:0; }
.ecp .a5 { animation: ecpFadeUp 0.5s 0.60s ease forwards; opacity:0; }

.ecp *{box-sizing:border-box;margin:0;padding:0}
.ecp{font-family:'DM Sans',sans-serif}
.ecp section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.ecp .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none;color:rgba(255,255,255,.32)}
.ecp .cr-dark{color:#94a3b8}

.ecp .s-title{background:#042f2e;justify-content:center;align-items:center}
.ecp .s-title .inner{text-align:center;z-index:1}
.ecp .s-title .eyebrow{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;margin-bottom:28px;font-weight:600}
.ecp .s-title h1{font-size:90px;color:#f8fafc;line-height:1.0;margin-bottom:28px;font-weight:700}
.ecp .s-title h1 span{color:#2dd4bf}
.ecp .s-title .amber-bar{width:100px;height:4px;background:#b45309;margin:0 auto 28px;border-radius:2px}
.ecp .s-title .sub{font-size:24px;color:#5eead4;font-weight:300;letter-spacing:.02em}

.ecp .s-agenda{background:#042f2e}
.ecp .agenda-inner{padding:80px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.ecp .agenda-inner .eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;margin-bottom:20px;font-weight:700}
.ecp .agenda-inner h2{font-size:56px;color:#f8fafc;font-weight:700;margin-bottom:48px}
.ecp .agenda-cols{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.ecp .agenda-group h3{font-size:20px;font-weight:700;color:#5eead4;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid rgba(94,234,212,.2)}
.ecp .agenda-item{display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.ecp .agenda-dot{width:10px;height:10px;border-radius:50%;background:#0f766e;flex-shrink:0}
.ecp .agenda-item p{font-size:19px;color:#94a3b8;line-height:1.4}

.ecp .s-sectionbreak{background:#0d3d3a;justify-content:center;align-items:center}
.ecp .sb-watermark{position:absolute;font-size:320px;font-weight:800;color:rgba(94,234,212,.05);line-height:1;pointer-events:none;user-select:none;bottom:-40px;right:80px}
.ecp .sb-inner{text-align:center;z-index:1}
.ecp .sb-eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;margin-bottom:18px;font-weight:700}
.ecp .sb-inner h2{font-size:66px;font-weight:700;color:#f8fafc;margin-bottom:20px;line-height:1.1}
.ecp .sb-inner p{font-size:22px;color:#5eead4;font-weight:300;opacity:.7}

.ecp .s-concept{background:#0d3d3a}
.ecp .concept-body{display:flex;flex:1;min-height:0}
.ecp .concept-left{width:790px;flex-shrink:0;padding:72px 68px 72px 96px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(255,255,255,.07)}
.ecp .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:#051f1e}
.ecp .concept-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px;width:fit-content;background:#134e4a;color:#5eead4}
.ecp .concept-left h2{font-size:50px;color:#f1f5f9;line-height:1.05;margin-bottom:18px;font-weight:700}
.ecp .concept-desc{font-size:19px;color:#94a3b8;line-height:1.75;margin-bottom:22px}
.ecp .concept-desc strong{color:#f1f5f9;font-weight:700}
.ecp .rule-card{border-radius:10px;padding:18px 22px;background:rgba(255,255,255,.04);border-left:4px solid #0f766e;font-size:17px;color:#ccfbf1;line-height:1.55;margin-bottom:14px}
.ecp .rule-card strong{color:#5eead4}
.ecp .warn-card{border-radius:10px;padding:16px 20px;background:#422006;border-left:4px solid #b45309;font-size:16px;color:#fde68a;line-height:1.55;margin-bottom:14px}
.ecp .tip-card{border-radius:10px;padding:16px 20px;background:#052e16;border-left:4px solid #16a34a;font-size:17px;color:#bbf7d0;line-height:1.55;margin-bottom:14px}
.ecp .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.ecp .chip{padding:7px 16px;border-radius:8px;font-size:14px;font-weight:500;background:rgba(255,255,255,.05);border:1px solid rgba(94,234,212,.25);color:#ccfbf1}

.ecp .s-light{background:#f0fdfa}
.ecp .s-light .concept-body{background:#f0fdfa}
.ecp .s-light .concept-left{border-right:1px solid #99f6e4;background:#f0fdfa}
.ecp .s-light .concept-right{background:#ccfbf1}
.ecp .s-light .concept-left h2{color:#042f2e}
.ecp .s-light .concept-desc{color:#134e4a}
.ecp .s-light .concept-desc strong{color:#042f2e}
.ecp .s-light .concept-badge{background:#ccfbf1;color:#0f766e}
.ecp .s-light .rule-card{background:white;border-left-color:#0f766e;color:#134e4a}
.ecp .s-light .rule-card strong{color:#0f766e}
.ecp .s-light .tip-card{background:#dcfce7;border-left-color:#16a34a;color:#14532d}

.ecp .s-compare{background:#f8fafc}
.ecp .compare-inner{padding:60px 80px;display:flex;flex-direction:column;height:100%}
.ecp .compare-inner h2{font-size:52px;font-weight:700;color:#1e1b4b;margin-bottom:36px}
.ecp .compare-cols{display:grid;grid-template-columns:1fr 1fr;gap:32px;flex:1}
.ecp .compare-card{border-radius:20px;padding:36px 40px;display:flex;flex-direction:column;gap:18px}
.ecp .compare-card.green{background:#f0fdf4;border:2px solid #86efac}
.ecp .compare-card.slate{background:#f8fafc;border:2px solid #cbd5e1}
.ecp .compare-title{font-size:28px;font-weight:700;margin-bottom:4px}
.ecp .compare-tag{font-size:16px;font-weight:500;margin-bottom:8px}
.ecp .compare-rule{font-size:15px;font-weight:600;padding:10px 16px;border-radius:8px;text-align:center}
.ecp .compare-item{font-size:17px;line-height:1.55;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.06)}

.ecp .s-act{background:#fdfaf5}
.ecp .act-body{display:flex;height:100%}
.ecp .act-left{width:840px;flex-shrink:0;padding:66px 74px 66px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.ecp .act-right{flex:1;display:flex;align-items:center;justify-content:center;padding:52px}
.ecp .act-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.ecp .act-left h2{font-size:40px;color:#1e1b4b;font-weight:700;line-height:1.1;margin-bottom:22px}
.ecp .scenario-text{font-size:18px;color:#334155;line-height:1.72;margin-bottom:20px;flex:1}
.ecp .scenario-text strong{color:#0f172a;font-weight:700}
.ecp .task-box{border-radius:12px;padding:20px 24px;background:#f0fdfa;border-left:5px solid #0f766e}
.ecp .task-box .task-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0f766e;margin-bottom:10px}
.ecp .task-box p{font-size:17px;color:#134e4a;line-height:1.6}
.ecp .hint-card{border-radius:10px;padding:14px 20px;background:#fef9c3;border-left:4px solid #ca8a04;font-size:15px;color:#713f12;margin-top:14px;line-height:1.55}

.ecp .s-ans{background:#f0fdf4}
.ecp .ans-header{padding:0 90px;height:88px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #bbf7d0;flex-shrink:0;background:#fff}
.ecp .ans-header h2{font-size:34px;font-weight:700;color:#14532d}

.ecp .s-ref{background:#042f2e}
.ecp .ref-inner{padding:50px 80px;display:flex;flex-direction:column;height:100%}
.ecp .ref-inner h2{font-size:48px;font-weight:700;color:#f8fafc;margin-bottom:32px}
.ecp .ref-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;flex:1}
.ecp .ref-card{background:rgba(255,255,255,.04);border:1px solid rgba(94,234,212,.12);border-radius:14px;padding:20px 18px;display:flex;flex-direction:column;gap:10px}
.ecp .ref-card .ref-name{font-size:14px;font-weight:700;color:#5eead4;letter-spacing:.06em}
.ecp .ref-card .ref-desc{font-size:13px;color:#64748b;line-height:1.5}

.ecp .s-takeaways{background:#042f2e}
.ecp .takeaways-inner{padding:72px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.ecp .takeaways-inner h2{font-size:52px;font-weight:700;color:#f1f5f9;margin-bottom:40px}
.ecp .takeaway-list{display:flex;flex-direction:column;gap:18px}
.ecp .takeaway-item{display:flex;align-items:flex-start;gap:20px;padding:22px 28px;border-radius:14px;background:rgba(15,118,110,.1);border:1px solid rgba(94,234,212,.12)}
.ecp .takeaway-num{width:38px;height:38px;border-radius:50%;background:#0f766e;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;flex-shrink:0;margin-top:1px}
.ecp .takeaway-item p{font-size:19px;color:#ccfbf1;line-height:1.6}
.ecp .takeaway-item strong{color:#f8fafc}

.ecp .s-end{background:#042f2e;justify-content:center;align-items:center}
.ecp .end-inner{text-align:center;z-index:1}
.ecp .end-inner h1{font-size:78px;font-weight:700;color:#f8fafc;margin-bottom:24px;line-height:1.1}
.ecp .end-inner p{font-size:24px;color:#5eead4;margin-bottom:14px;font-weight:300}
.ecp .end-note{font-size:16px;color:#134e4a;margin-top:8px}
`,$e=[{classes:"s-title",label:"01 Title",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="ecp-rg1" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="rgba(15,118,110,0.2)"/>
      <stop offset="100%" stop-color="rgba(4,47,46,0)"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#ecp-rg1)"/>
  <circle cx="1720" cy="160" r="320" fill="rgba(45,212,191,0.06)"/>
  <circle cx="200" cy="900" r="280" fill="rgba(15,118,110,0.05)"/>
  <text x="1560" y="980" font-size="200" font-weight="800" fill="rgba(45,212,191,0.04)" font-family="'DM Sans',sans-serif" text-anchor="middle">CP</text>
</svg>
<div class="inner a1">
  <p class="eyebrow">DATABASE MANAGEMENT SYSTEMS · MBI802</p>
  <h1>Composite Attributes<br/><span>&amp; Participation Constraints</span></h1>
  <div class="amber-bar"></div>
  <p class="sub">ER Chen's Notation — Lesson 4 of 5</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-agenda",label:"02 What You Will Learn",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1820" cy="100" r="380" fill="rgba(15,118,110,0.05)"/>
</svg>
<div class="agenda-inner">
  <p class="eyebrow a1">Lesson Roadmap</p>
  <h2 class="a1">What You'll Learn</h2>
  <div class="agenda-cols">
    <div class="agenda-group a2">
      <h3>Part A — Composite Attributes</h3>
      <div class="agenda-item"><div class="agenda-dot"></div><p>What composite attributes are and why they matter</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Sub-attribute branching notation in Chen's diagrams</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Real-world examples — Name, Address</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Composite vs. simple vs. multivalued</p></div>
    </div>
    <div class="agenda-group a3">
      <h3>Part B — Participation Constraints</h3>
      <div class="agenda-item"><div class="agenda-dot"></div><p>What participation constraints are and why they matter</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Total participation — double line (══) notation</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Partial participation — single line (──) notation</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Applying constraints to real business rules</p></div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-sectionbreak",label:"03 Section — Composite Attributes",html:`<div class="sb-watermark">01</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">PART ONE</p>
  <h2 class="a2">Composite Attributes</h2>
  <p class="a3">An attribute composed of smaller, meaningful sub-attributes</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"04 What Is a Composite Attribute",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Composite Attributes</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Definition</div>
    <h2 class="a1">A Whole Made of Parts</h2>
    <p class="concept-desc a2">A <strong>composite attribute</strong> is an attribute that can be broken down into smaller sub-attributes, each representing a distinct, meaningful piece of information. Unlike a simple attribute, it has <strong>internal structure</strong>.</p>
    <div class="rule-card a3">Key Insight — When you need to <strong>query or process individual parts</strong> of an attribute (e.g., search by City, sort by LastName, extract PostCode for a report), model it as composite.</div>
    <div class="chips a4">
      <span class="chip">Has sub-attributes</span>
      <span class="chip">Branching notation</span>
      <span class="chip">Individually queryable</span>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 820 580" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- CUSTOMER entity -->
      <rect x="60" y="258" width="200" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="160" y="300" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">CUSTOMER</text>

      <!-- CustomerId (key) -->
      <line x1="120" y1="258" x2="90" y2="185" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="70" cy="165" rx="74" ry="27" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="70" y="162" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">CustomerId</text>

      <!-- Line entity to Address -->
      <line x1="230" y1="294" x2="340" y2="248" stroke="#0f766e" stroke-width="2"/>

      <!-- Address composite ellipse -->
      <ellipse cx="420" cy="228" rx="96" ry="36" fill="#f0fdfa" stroke="#0f766e" stroke-width="3"/>
      <text x="420" y="234" text-anchor="middle" font-size="17" font-weight="700" fill="#0f766e">Address</text>

      <!-- Lines from Address to sub-attrs -->
      <line x1="366" y1="200" x2="288" y2="130" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="405" y1="193" x2="390" y2="120" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="464" y1="198" x2="540" y2="128" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="504" y1="222" x2="618" y2="210" stroke="#0f766e" stroke-width="1.5"/>

      <!-- Sub-attribute ellipses -->
      <ellipse cx="250" cy="108" rx="78" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="250" y="113" text-anchor="middle" font-size="13" fill="#134e4a">StreetNumber</text>

      <ellipse cx="398" cy="98" rx="70" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="398" y="103" text-anchor="middle" font-size="13" fill="#134e4a">StreetName</text>

      <ellipse cx="564" cy="106" rx="52" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="564" y="111" text-anchor="middle" font-size="13" fill="#134e4a">City</text>

      <ellipse cx="656" cy="222" rx="66" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="656" y="227" text-anchor="middle" font-size="13" fill="#134e4a">PostCode</text>

      <!-- Annotation -->
      <rect x="50" y="390" width="720" height="72" rx="10" fill="rgba(15,118,110,0.12)" stroke="rgba(45,212,191,0.3)" stroke-width="1"/>
      <text x="410" y="420" text-anchor="middle" font-size="15" fill="#5eead4" font-weight="700">← Outer ellipse = composite attribute (thicker teal border)</text>
      <text x="410" y="446" text-anchor="middle" font-size="14" fill="#94a3b8">Small ellipses connected by lines = sub-attributes (each queryable separately)</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"05 Chen's Notation — How to Draw",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Chen's Notation Rule</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">The Rule</div>
    <h2 class="a1">Parent → Children Branching</h2>
    <div class="rule-card a2">① Draw an ellipse for the <strong>composite attribute</strong> — use a thicker border to distinguish it</div>
    <div class="rule-card a3">② Draw smaller ellipses for each <strong>sub-attribute</strong>, connected to the parent by lines</div>
    <div class="rule-card a4">③ Sub-attributes can themselves be <strong>composite</strong> — nested branching is allowed</div>
    <div class="tip-card a5">In SQL mapping, the composite parent is <strong>never a column</strong>. Only the leaf sub-attributes become columns in the table.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 740 500" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- Parent composite ellipse (large, centre) -->
      <ellipse cx="370" cy="240" rx="110" ry="42" fill="#f0fdfa" stroke="#0f766e" stroke-width="3.5"/>
      <text x="370" y="246" text-anchor="middle" font-size="18" font-weight="700" fill="#0f766e">CompositeAttr</text>

      <!-- Sub-attribute 1 (top-left) -->
      <line x1="298" y1="204" x2="190" y2="130" stroke="#0f766e" stroke-width="1.5"/>
      <ellipse cx="142" cy="108" rx="86" ry="30" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="142" y="113" text-anchor="middle" font-size="14" fill="#134e4a">SubAttribute1</text>

      <!-- Sub-attribute 2 (top-centre) -->
      <line x1="370" y1="198" x2="370" y2="128" stroke="#0f766e" stroke-width="1.5"/>
      <ellipse cx="370" cy="102" rx="86" ry="30" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="370" y="107" text-anchor="middle" font-size="14" fill="#134e4a">SubAttribute2</text>

      <!-- Sub-attribute 3 (top-right) -->
      <line x1="442" y1="204" x2="548" y2="130" stroke="#0f766e" stroke-width="1.5"/>
      <ellipse cx="596" cy="108" rx="86" ry="30" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="596" y="113" text-anchor="middle" font-size="14" fill="#134e4a">SubAttribute3</text>

      <!-- Labels -->
      <text x="40" y="74" font-size="13" fill="#5eead4" font-weight="700">Sub-attributes (leaves)</text>
      <line x1="40" y1="80" x2="56" y2="96" stroke="#5eead4" stroke-width="1" stroke-dasharray="3,2"/>

      <text x="460" y="270" font-size="13" fill="#5eead4" font-weight="700">Parent composite</text>
      <text x="460" y="290" font-size="13" fill="#5eead4">(thicker border)</text>

      <!-- Bottom note box -->
      <rect x="60" y="370" width="620" height="62" rx="10" fill="rgba(15,118,110,0.15)" stroke="rgba(45,212,191,0.25)"/>
      <text x="370" y="396" text-anchor="middle" font-size="14" fill="#5eead4" font-weight="700">Example: Name → (FirstName, MiddleName, LastName)</text>
      <text x="370" y="418" text-anchor="middle" font-size="13" fill="#64748b">Each sub-attribute becomes its own column in SQL: first_name, middle_name, last_name</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-light",label:"06 Real Example — PERSON Entity",html:`<div style="padding:38px 96px 18px;background:#f0fdfa;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#0f766e;font-weight:700">Real-World Example</div>
</div>
<div class="concept-body">
  <div class="concept-left" style="background:#f0fdfa">
    <div class="concept-badge a1">PERSON Entity</div>
    <h2 class="a1" style="color:#042f2e">Name &amp; Address as Composites</h2>
    <p class="concept-desc a2" style="color:#134e4a">A PERSON entity commonly has two composite attributes: <strong>Name</strong> (FirstName, MiddleName, LastName) and <strong>Address</strong> (StreetName, City, PostCode). Simple attributes like DateOfBirth and PersonId remain flat ellipses.</p>
    <div class="rule-card a3" style="background:white;border-left-color:#0f766e;color:#134e4a"><strong>SQL Impact:</strong> The PERSON table will NOT have "name" or "address" columns. Instead: first_name, middle_name, last_name, street_name, city, post_code.</div>
    <div class="hint-card a4">Always ask: "Will I ever need to search, sort, or filter by a <em>part</em> of this attribute?" If yes → make it composite.</div>
  </div>
  <div class="concept-right" style="background:#ccfbf1">
    <svg viewBox="0 0 960 700" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- PERSON entity -->
      <rect x="380" y="300" width="200" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="480" y="342" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">PERSON</text>

      <!-- PersonId (key) -->
      <line x1="430" y1="300" x2="365" y2="228" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="328" cy="208" rx="72" ry="27" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="328" y="205" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">PersonId</text>

      <!-- DateOfBirth (simple) -->
      <line x1="530" y1="300" x2="592" y2="228" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="628" cy="208" rx="80" ry="27" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="628" y="213" text-anchor="middle" font-size="14" fill="#374151">DateOfBirth</text>

      <!-- Name composite -->
      <line x1="400" y1="300" x2="240" y2="372" stroke="#0f766e" stroke-width="2"/>
      <ellipse cx="175" cy="388" rx="88" ry="32" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
      <text x="175" y="394" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e">Name</text>

      <!-- Name sub-attrs -->
      <line x1="120" y1="365" x2="68" y2="294" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="46" cy="270" rx="70" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="46" y="275" text-anchor="middle" font-size="12" fill="#134e4a">FirstName</text>

      <line x1="168" y1="356" x2="142" y2="282" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="136" cy="256" rx="74" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="136" y="261" text-anchor="middle" font-size="12" fill="#134e4a">MiddleName</text>

      <line x1="230" y1="360" x2="260" y2="290" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="274" cy="266" rx="66" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="274" y="271" text-anchor="middle" font-size="12" fill="#134e4a">LastName</text>

      <!-- Address composite -->
      <line x1="560" y1="300" x2="720" y2="372" stroke="#0f766e" stroke-width="2"/>
      <ellipse cx="782" cy="388" rx="88" ry="32" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
      <text x="782" y="394" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e">Address</text>

      <!-- Address sub-attrs -->
      <line x1="726" y1="362" x2="660" y2="290" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="638" cy="266" rx="72" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="638" y="271" text-anchor="middle" font-size="12" fill="#134e4a">StreetName</text>

      <line x1="782" y1="356" x2="800" y2="280" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="810" cy="256" rx="50" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="810" y="261" text-anchor="middle" font-size="12" fill="#134e4a">City</text>

      <line x1="840" y1="362" x2="900" y2="290" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="920" cy="266" rx="62" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="920" y="271" text-anchor="middle" font-size="12" fill="#134e4a">PostCode</text>

      <!-- Legend labels -->
      <text x="100" y="490" text-anchor="middle" font-size="13" fill="#0f766e" font-weight="700">Composite (teal)</text>
      <text x="490" y="490" text-anchor="middle" font-size="13" fill="#64748b" font-weight="700">Key attribute (underlined)</text>
      <text x="820" y="490" text-anchor="middle" font-size="13" fill="#94a3b8" font-weight="700">Simple attribute (gray)</text>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-compare",label:"07 Composite vs Simple vs Multivalued",html:`<div class="compare-inner">
  <h2 class="a1">Three Types of Attributes at a Glance</h2>
  <div class="compare-cols">
    <div class="compare-card a2" style="background:#f0fdfa;border:2px solid #5eead4">
      <div>
        <div class="compare-title" style="color:#0f766e">Composite Attribute</div>
        <div class="compare-tag" style="color:#134e4a">One value — broken into parts</div>
      </div>
      <svg viewBox="0 0 340 130" style="height:100px;width:auto" font-family="'DM Sans',sans-serif">
        <ellipse cx="170" cy="68" rx="80" ry="28" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
        <text x="170" y="73" text-anchor="middle" font-size="14" font-weight="700" fill="#0f766e">Address</text>
        <line x1="120" y1="44" x2="66" y2="18" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="46" cy="12" rx="52" ry="16" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <text x="46" y="17" text-anchor="middle" font-size="11" fill="#134e4a">City</text>
        <line x1="170" y1="40" x2="170" y2="16" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="170" cy="10" rx="62" ry="14" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <text x="170" y="15" text-anchor="middle" font-size="11" fill="#134e4a">StreetName</text>
        <line x1="220" y1="44" x2="274" y2="18" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="296" cy="12" rx="56" ry="16" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <text x="296" y="17" text-anchor="middle" font-size="11" fill="#134e4a">PostCode</text>
      </svg>
      <div class="compare-item" style="color:#134e4a;border-bottom-color:#99f6e4">Example: <strong>Address</strong> = StreetName + City + PostCode</div>
      <div class="compare-item" style="color:#134e4a;border-bottom:0">SQL: <strong>street_name, city, post_code</strong> columns (no "address" column)</div>
    </div>

    <div class="compare-card a3" style="background:#f8fafc;border:2px solid #cbd5e1">
      <div>
        <div class="compare-title" style="color:#475569">Simple Attribute</div>
        <div class="compare-tag" style="color:#64748b">One value — no internal parts</div>
      </div>
      <svg viewBox="0 0 340 130" style="height:100px;width:auto" font-family="'DM Sans',sans-serif">
        <ellipse cx="170" cy="68" rx="80" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
        <text x="170" y="73" text-anchor="middle" font-size="14" fill="#374151">DateOfBirth</text>
      </svg>
      <div class="compare-item" style="color:#475569;border-bottom-color:#e2e8f0">Example: <strong>DateOfBirth</strong> is always one date value</div>
      <div class="compare-item" style="color:#475569;border-bottom:0">SQL: <strong>date_of_birth</strong> column — stored directly as-is</div>
    </div>

    <div class="compare-card a4" style="background:#fef9c3;border:2px solid #fde68a;grid-column:1/-1">
      <div>
        <div class="compare-title" style="color:#92400e">Multivalued Attribute</div>
        <div class="compare-tag" style="color:#78350f">MULTIPLE values — no internal structure (double ellipse)</div>
      </div>
      <div style="display:flex;align-items:center;gap:48px">
        <svg viewBox="0 0 340 100" style="height:80px;width:auto" font-family="'DM Sans',sans-serif">
          <ellipse cx="170" cy="55" rx="84" ry="30" fill="white" stroke="#b45309" stroke-width="2"/>
          <ellipse cx="170" cy="55" rx="74" ry="22" fill="#fef9c3" stroke="#b45309" stroke-width="2"/>
          <text x="170" y="60" text-anchor="middle" font-size="14" fill="#92400e" font-weight="600">PhoneNumber</text>
        </svg>
        <div style="flex:1">
          <div class="compare-item" style="color:#78350f;border-bottom-color:#fde68a">Example: <strong>{PhoneNumber}</strong> holds 021-555-1234 AND 09-888-9999 simultaneously</div>
          <div class="compare-item" style="color:#78350f;border-bottom:0">SQL: creates a <strong>separate table</strong> — e.g. CUSTOMER_PHONE(customer_id FK, phone_number PK)</div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-sectionbreak",label:"08 Section — Participation Constraints",html:`<div class="sb-watermark">02</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">PART TWO</p>
  <h2 class="a2">Participation Constraints</h2>
  <p class="a3">Do ALL entities have to join the relationship — or just SOME?</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"09 What Are Participation Constraints",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Participation Constraints</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Definition</div>
    <h2 class="a1">Mandatory vs. Optional</h2>
    <p class="concept-desc a2">A <strong>participation constraint</strong> specifies whether ALL or only SOME entities in an entity set must participate in a relationship. It captures a <strong>business rule</strong> about obligation.</p>
    <div class="rule-card a3">Think of it as a contract: "<em>Every X must be linked to a Y</em>" (total) vs. "<em>Some X may be linked to a Y, but not required</em>" (partial).</div>
    <div class="chips a4">
      <span class="chip">Total = mandatory</span>
      <span class="chip">Partial = optional</span>
      <span class="chip">Enforced by DB constraints</span>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 820 520" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- Total card -->
      <rect x="40" y="40" width="340" height="200" rx="14" fill="rgba(22,163,74,0.08)" stroke="#16a34a" stroke-width="2"/>
      <text x="210" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#16a34a" letter-spacing="0.08em">TOTAL PARTICIPATION</text>
      <text x="210" y="108" text-anchor="middle" font-size="14" fill="#166534">Double line (══)</text>
      <line x1="100" y1="145" x2="180" y2="145" stroke="#16a34a" stroke-width="2.5"/>
      <line x1="100" y1="151" x2="180" y2="151" stroke="#16a34a" stroke-width="2.5"/>
      <text x="210" y="186" text-anchor="middle" font-size="14" fill="#166534" font-style="italic">"Every EMPLOYEE must</text>
      <text x="210" y="208" text-anchor="middle" font-size="14" fill="#166534" font-style="italic">work in a DEPARTMENT"</text>
      <text x="210" y="228" text-anchor="middle" font-size="13" fill="#4ade80">Key word: must / every / all / required</text>

      <!-- Partial card -->
      <rect x="440" y="40" width="340" height="200" rx="14" fill="rgba(100,116,139,0.08)" stroke="#94a3b8" stroke-width="2"/>
      <text x="610" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#475569" letter-spacing="0.08em">PARTIAL PARTICIPATION</text>
      <text x="610" y="108" text-anchor="middle" font-size="14" fill="#475569">Single line (──)</text>
      <line x1="500" y1="148" x2="580" y2="148" stroke="#94a3b8" stroke-width="2"/>
      <text x="610" y="186" text-anchor="middle" font-size="14" fill="#475569" font-style="italic">"Some EMPLOYEE may</text>
      <text x="610" y="208" text-anchor="middle" font-size="14" fill="#475569" font-style="italic">manage a DEPARTMENT"</text>
      <text x="610" y="228" text-anchor="middle" font-size="13" fill="#94a3b8">Key word: may / can / optional / might</text>

      <!-- Bottom diagram -->
      <rect x="40" y="320" width="740" height="140" rx="14" fill="rgba(15,118,110,0.08)" stroke="rgba(45,212,191,0.2)"/>
      <text x="420" y="355" text-anchor="middle" font-size="14" fill="#5eead4" font-weight="700">Why does it matter?</text>
      <text x="420" y="380" text-anchor="middle" font-size="14" fill="#94a3b8">Total participation maps to a NOT NULL FK constraint in SQL.</text>
      <text x="420" y="404" text-anchor="middle" font-size="14" fill="#94a3b8">Partial participation means the FK column allows NULL values.</text>
      <text x="420" y="428" text-anchor="middle" font-size="13" fill="#64748b">Getting this right prevents data integrity issues at the database level.</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"10 Total Participation — Double Line",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Participation Constraints</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1" style="background:#14532d;color:#86efac">Total Participation</div>
    <h2 class="a1">Double Line Notation ══</h2>
    <p class="concept-desc a2">When <strong>every entity</strong> in the set must participate in at least one relationship instance, we draw a <strong>double line</strong> between the entity and the relationship diamond.</p>
    <div class="rule-card a3">Also called <strong>mandatory</strong> or <strong>existence-dependent</strong> participation. Business rule language: <em>"Every X must…"</em>, <em>"All X are…"</em>, <em>"X is required to…"</em></div>
    <div class="tip-card a4">Business rule: "Every EMPLOYEE must belong to exactly one DEPARTMENT." → EMPLOYEE side gets a <strong>double line</strong> to the works_in relationship.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 960 500" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- EMPLOYEE entity -->
      <rect x="40" y="194" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="150" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">EMPLOYEE</text>

      <!-- DOUBLE LINE from EMPLOYEE to diamond (total) -->
      <line x1="260" y1="226" x2="388" y2="226" stroke="#16a34a" stroke-width="2.5"/>
      <line x1="260" y1="233" x2="388" y2="233" stroke="#16a34a" stroke-width="2.5"/>
      <text x="324" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#16a34a">N</text>

      <!-- works_in diamond -->
      <polygon points="488,190 600,229 488,268 376,229" fill="#0d3d3a" stroke="#2dd4bf" stroke-width="3"/>
      <text x="488" y="235" text-anchor="middle" font-size="17" font-weight="700" fill="#5eead4">works_in</text>

      <!-- SINGLE LINE from diamond to DEPARTMENT (partial) -->
      <line x1="600" y1="229" x2="700" y2="229" stroke="#94a3b8" stroke-width="2"/>
      <text x="650" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

      <!-- DEPARTMENT entity -->
      <rect x="700" y="194" width="240" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="820" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">DEPARTMENT</text>

      <!-- Annotation: EMPLOYEE side -->
      <rect x="20" y="315" width="260" height="72" rx="10" fill="rgba(22,163,74,0.12)" stroke="#16a34a" stroke-width="1.5"/>
      <text x="150" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#16a34a">Total participation</text>
      <text x="150" y="366" text-anchor="middle" font-size="13" fill="#166534">Every employee MUST</text>
      <text x="150" y="384" text-anchor="middle" font-size="13" fill="#166534">work in a department</text>

      <!-- Annotation: DEPARTMENT side -->
      <rect x="680" y="315" width="260" height="72" rx="10" fill="rgba(100,116,139,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="810" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial participation</text>
      <text x="810" y="366" text-anchor="middle" font-size="13" fill="#64748b">A department CAN exist</text>
      <text x="810" y="384" text-anchor="middle" font-size="13" fill="#64748b">with no employees yet</text>

      <!-- Double line label -->
      <text x="324" y="264" text-anchor="middle" font-size="12" fill="#4ade80">Double line ══</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"11 Partial Participation — Single Line",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Participation Constraints</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1" style="background:#1e293b;color:#94a3b8">Partial Participation</div>
    <h2 class="a1">Single Line Notation ──</h2>
    <p class="concept-desc a2">When only <strong>some entities</strong> need to participate in a relationship, we use the default <strong>single line</strong>. This is the optional constraint — entities may or may not be linked.</p>
    <div class="rule-card a3">Also called <strong>optional</strong> participation. Business rule language: <em>"Some X may…"</em>, <em>"An X can but doesn't have to…"</em>, <em>"X is not required to…"</em></div>
    <div class="tip-card a4">Business rule: "Some EMPLOYEE may manage a DEPARTMENT (but most employees don't manage anything)." → single line from EMPLOYEE to manages.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 960 500" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- EMPLOYEE entity -->
      <rect x="40" y="194" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="150" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">EMPLOYEE</text>

      <!-- SINGLE LINE both sides (partial) -->
      <line x1="260" y1="229" x2="376" y2="229" stroke="#94a3b8" stroke-width="2"/>
      <text x="318" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

      <!-- manages diamond -->
      <polygon points="488,190 600,229 488,268 376,229" fill="#0d3d3a" stroke="#94a3b8" stroke-width="2.5"/>
      <text x="488" y="235" text-anchor="middle" font-size="17" font-weight="700" fill="#94a3b8">manages</text>

      <line x1="600" y1="229" x2="700" y2="229" stroke="#94a3b8" stroke-width="2"/>
      <text x="650" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

      <!-- DEPARTMENT entity -->
      <rect x="700" y="194" width="240" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="820" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">DEPARTMENT</text>

      <!-- Annotation EMPLOYEE -->
      <rect x="20" y="315" width="270" height="72" rx="10" fill="rgba(100,116,139,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="155" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial participation</text>
      <text x="155" y="366" text-anchor="middle" font-size="13" fill="#64748b">Only SOME employees</text>
      <text x="155" y="384" text-anchor="middle" font-size="13" fill="#64748b">manage a department</text>

      <!-- Annotation DEPARTMENT -->
      <rect x="680" y="315" width="270" height="72" rx="10" fill="rgba(100,116,139,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="815" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial participation</text>
      <text x="815" y="366" text-anchor="middle" font-size="13" fill="#64748b">Some departments may</text>
      <text x="815" y="384" text-anchor="middle" font-size="13" fill="#64748b">have no manager yet</text>

      <!-- Single line label -->
      <text x="318" y="258" text-anchor="middle" font-size="12" fill="#94a3b8">Single line ──</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-compare",label:"12 Total vs Partial — Side by Side",html:`<div class="compare-inner">
  <h2 class="a1">Total vs. Partial at a Glance</h2>
  <div class="compare-cols">
    <div class="compare-card green a2">
      <div>
        <div class="compare-title" style="color:#15803d">Total Participation (══)</div>
        <div class="compare-tag" style="color:#166534">EVERY entity must participate</div>
      </div>
      <div class="compare-rule" style="background:#dcfce7;color:#14532d">Entity ══ Relationship</div>
      <div class="compare-item" style="color:#166534">Every ORDER must belong to a CUSTOMER</div>
      <div class="compare-item" style="color:#166534">Every ORDER_ITEM must be part of an ORDER</div>
      <div class="compare-item" style="color:#166534;border-bottom:0">Every EMPLOYEE must work in a DEPARTMENT</div>
      <div class="compare-rule" style="background:#bbf7d0;color:#14532d;font-size:14px;margin-top:8px">Key words: <em>must · every · all · required · always</em></div>
    </div>

    <div class="compare-card slate a3">
      <div>
        <div class="compare-title" style="color:#475569">Partial Participation (──)</div>
        <div class="compare-tag" style="color:#64748b">SOME entities may not participate</div>
      </div>
      <div class="compare-rule" style="background:#f1f5f9;color:#475569">Entity ── Relationship</div>
      <div class="compare-item" style="color:#475569">Some CUSTOMER may not have placed any ORDER</div>
      <div class="compare-item" style="color:#475569">Some EMPLOYEE may not manage any DEPARTMENT</div>
      <div class="compare-item" style="color:#475569;border-bottom:0">Some LECTURER may not supervise any STUDENT</div>
      <div class="compare-rule" style="background:#e2e8f0;color:#475569;font-size:14px;margin-top:8px">Key words: <em>may · can · optional · might · not required</em></div>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-sectionbreak",label:"13 Section — Activities",html:`<div class="sb-watermark">03</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">ACTIVITIES</p>
  <h2 class="a2">Apply What You've Learned</h2>
  <p class="a3">2 activities · Composite attributes + Participation constraints</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"14 Activity 1 — Bookstore",html:`<div class="act-body">
  <div class="act-left">
    <div class="act-badge a1" style="background:#fef3c7;color:#92400e">Activity 1</div>
    <h2 class="a2">An Online Bookstore</h2>
    <p class="scenario-text a3">A bookstore system stores details about <strong>BOOK</strong> and <strong>AUTHOR</strong> entities.<br/><br/>
      Each <strong>BOOK</strong> has a BookId (key), a Title, a Price, and a full publication address comprising <strong>Building</strong>, <strong>StreetName</strong>, <strong>City</strong>, and <strong>Country</strong>.<br/><br/>
      Each <strong>AUTHOR</strong> has an AuthorId (key) and a full name with <strong>FirstName</strong> and <strong>LastName</strong>.
    </p>
    <div class="task-box a4">
      <div class="task-title">Your Task</div>
      <p>1. Identify the composite attributes in both entities.<br/>2. Draw the ER diagram showing both entities with all their attributes using Chen's notation. Show composite sub-attributes branching correctly.</p>
    </div>
    <div class="hint-card a5">Look for attributes described with "comprising", "consisting of", or that have multiple parts. Each part that could be queried independently is a sub-attribute.</div>
  </div>
  <div class="act-right">
    <div style="width:100%;height:100%;border:2px dashed #a7f3d0;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#f0fdfa">
      <p style="font-size:20px;color:#5eead4;font-weight:500">Your diagram here</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"15 Answer 1 — Bookstore",html:`<div class="ans-header">
  <span style="background:#dcfce7;color:#14532d;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Answer</span>
  <h2>Activity 1 — Bookstore ER Diagram</h2>
</div>
<div style="flex:1;position:relative;overflow:hidden">
<svg style="width:100%;height:100%" viewBox="0 0 1920 870" font-family="'DM Sans',sans-serif">

  <!-- BOOK entity -->
  <rect x="200" y="360" width="200" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="300" y="402" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">BOOK</text>

  <!-- BookId (key) -->
  <line x1="250" y1="360" x2="200" y2="278" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="178" cy="258" rx="68" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="178" y="255" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">BookId</text>

  <!-- Title (simple) -->
  <line x1="310" y1="360" x2="340" y2="278" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="356" cy="258" rx="52" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="356" y="263" text-anchor="middle" font-size="14" fill="#374151">Title</text>

  <!-- Price (simple) -->
  <line x1="375" y1="375" x2="440" y2="318" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="468" cy="302" rx="52" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="468" y="307" text-anchor="middle" font-size="14" fill="#374151">Price</text>

  <!-- PublicationAddress (composite) -->
  <line x1="265" y1="432" x2="240" y2="510" stroke="#0f766e" stroke-width="2"/>
  <ellipse cx="235" cy="542" rx="122" ry="34" fill="#f0fdfa" stroke="#0f766e" stroke-width="3"/>
  <text x="235" y="549" text-anchor="middle" font-size="15" font-weight="700" fill="#0f766e">PublicationAddress</text>

  <!-- PublicationAddress sub-attrs -->
  <line x1="156" y1="568" x2="88" y2="638" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="66" cy="658" rx="66" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="66" y="663" text-anchor="middle" font-size="12" fill="#134e4a">Building</text>

  <line x1="196" y1="575" x2="170" y2="650" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="166" cy="672" rx="72" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="166" y="677" text-anchor="middle" font-size="12" fill="#134e4a">StreetName</text>

  <line x1="270" y1="576" x2="295" y2="650" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="300" cy="672" rx="50" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="300" y="677" text-anchor="middle" font-size="12" fill="#134e4a">City</text>

  <line x1="340" y1="564" x2="405" y2="638" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="426" cy="658" rx="66" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="426" y="663" text-anchor="middle" font-size="12" fill="#134e4a">Country</text>

  <!-- Composite label annotation -->
  <text x="235" y="730" text-anchor="middle" font-size="13" fill="#0f766e" font-weight="600">↑ Composite attribute (4 sub-attrs)</text>

  <!-- AUTHOR entity -->
  <rect x="1450" y="360" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="1560" y="402" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">AUTHOR</text>

  <!-- AuthorId (key) -->
  <line x1="1500" y1="360" x2="1440" y2="278" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1414" cy="258" rx="72" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1414" y="255" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">AuthorId</text>

  <!-- Name (composite) -->
  <line x1="1620" y1="360" x2="1690" y2="282" stroke="#0f766e" stroke-width="2"/>
  <ellipse cx="1720" cy="258" rx="72" ry="30" fill="#f0fdfa" stroke="#0f766e" stroke-width="3"/>
  <text x="1720" y="264" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e">Name</text>

  <!-- Name sub-attrs -->
  <line x1="1666" y1="234" x2="1600" y2="174" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="1570" cy="154" rx="72" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="1570" y="159" text-anchor="middle" font-size="13" fill="#134e4a">FirstName</text>

  <line x1="1774" y1="234" x2="1836" y2="174" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="1862" cy="154" rx="68" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="1862" y="159" text-anchor="middle" font-size="13" fill="#134e4a">LastName</text>

  <text x="1720" y="320" text-anchor="middle" font-size="13" fill="#0f766e" font-weight="600">↑ Composite attribute (2 sub-attrs)</text>

  <!-- Middle separator + labels -->
  <line x1="700" y1="100" x2="700" y2="750" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="8,6"/>
  <text x="960" y="130" text-anchor="middle" font-size="20" font-weight="700" fill="#0f766e" letter-spacing="0.08em">KEY: Composite attributes highlighted in teal</text>
  <rect x="720" y="152" width="480" height="44" rx="8" fill="rgba(15,118,110,0.08)" stroke="rgba(45,212,191,0.3)"/>
  <text x="960" y="180" text-anchor="middle" font-size="14" fill="#5eead4">Teal ellipse (thick border) = composite parent · Small teal ellipses = sub-attributes</text>
</svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"16 Activity 2 — University Participation",html:`<div class="act-body">
  <div class="act-left">
    <div class="act-badge a1" style="background:#fef3c7;color:#92400e">Activity 2</div>
    <h2 class="a2">A University System</h2>
    <p class="scenario-text a3">A university database tracks <strong>LECTURER</strong> and <strong>MODULE</strong> entities. The following business rules apply:<br/><br/>
      <strong>(1)</strong> Every LECTURER must teach at least one MODULE.<br/>
      <strong>(2)</strong> A MODULE may or may not currently be taught (some modules are inactive).<br/>
      <strong>(3)</strong> Every MODULE must be assigned to exactly one DEPARTMENT.<br/>
      <strong>(4)</strong> A DEPARTMENT can exist even if it currently has no MODULEs assigned.
    </p>
    <div class="task-box a4">
      <div class="task-title">Your Task</div>
      <p>Draw the ER diagram segment showing LECTURER, MODULE, and DEPARTMENT with their <strong>teaches</strong> and <strong>assigned_to</strong> relationships. Apply the correct participation constraints (double or single lines) based on the 4 business rules above.</p>
    </div>
  </div>
  <div class="act-right">
    <div style="width:100%;height:100%;border:2px dashed #a7f3d0;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#f0fdfa">
      <p style="font-size:20px;color:#5eead4;font-weight:500">Your diagram here</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans",label:"17 Answer 2 — University Participation",html:`<div class="ans-header">
  <span style="background:#dcfce7;color:#14532d;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Answer</span>
  <h2>Activity 2 — University Participation Constraints</h2>
</div>
<div style="flex:1;position:relative;overflow:hidden">
<svg style="width:100%;height:100%" viewBox="0 0 1920 790" font-family="'DM Sans',sans-serif">

  <!-- LECTURER entity -->
  <rect x="80" y="330" width="240" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="200" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">LECTURER</text>

  <!-- teaches diamond -->
  <polygon points="620,296 760,368 620,440 480,368" fill="#0d3d3a" stroke="#2dd4bf" stroke-width="3"/>
  <text x="620" y="374" text-anchor="middle" font-size="18" font-weight="700" fill="#5eead4">teaches</text>

  <!-- MODULE entity -->
  <rect x="850" y="330" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="960" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">MODULE</text>

  <!-- assigned_to diamond -->
  <polygon points="1360,296 1500,368 1360,440 1220,368" fill="#0d3d3a" stroke="#2dd4bf" stroke-width="3"/>
  <text x="1360" y="374" text-anchor="middle" font-size="17" font-weight="700" fill="#5eead4">assigned_to</text>

  <!-- DEPARTMENT entity -->
  <rect x="1590" y="330" width="250" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="1715" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">DEPARTMENT</text>

  <!-- LECTURER ══ teaches (Rule 1: every lecturer MUST teach) -->
  <line x1="320" y1="362" x2="480" y2="362" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="320" y1="369" x2="480" y2="369" stroke="#16a34a" stroke-width="2.5"/>
  <text x="400" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#16a34a">N</text>

  <!-- teaches ── MODULE (Rule 2: module MAY not be taught) -->
  <line x1="760" y1="366" x2="850" y2="366" stroke="#94a3b8" stroke-width="2"/>
  <text x="805" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">M</text>

  <!-- MODULE ══ assigned_to (Rule 3: every module MUST be in a dept) -->
  <line x1="1070" y1="362" x2="1220" y2="362" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="1070" y1="369" x2="1220" y2="369" stroke="#16a34a" stroke-width="2.5"/>
  <text x="1145" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#16a34a">N</text>

  <!-- assigned_to ── DEPARTMENT (Rule 4: dept CAN have no modules) -->
  <line x1="1500" y1="366" x2="1590" y2="366" stroke="#94a3b8" stroke-width="2"/>
  <text x="1545" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

  <!-- Annotation boxes -->
  <rect x="60" y="460" width="270" height="72" rx="10" fill="rgba(22,163,74,0.1)" stroke="#16a34a" stroke-width="1.5"/>
  <text x="195" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="#16a34a">Total (Rule 1)</text>
  <text x="195" y="508" text-anchor="middle" font-size="13" fill="#166534">Every lecturer MUST</text>
  <text x="195" y="526" text-anchor="middle" font-size="13" fill="#166534">teach at least one module</text>

  <rect x="840" y="460" width="250" height="72" rx="10" fill="rgba(100,116,139,0.08)" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="965" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial (Rule 2)</text>
  <text x="965" y="508" text-anchor="middle" font-size="13" fill="#64748b">Some modules MAY</text>
  <text x="965" y="526" text-anchor="middle" font-size="13" fill="#64748b">be inactive (untaught)</text>

  <rect x="840" y="545" width="250" height="72" rx="10" fill="rgba(22,163,74,0.1)" stroke="#16a34a" stroke-width="1.5"/>
  <text x="965" y="572" text-anchor="middle" font-size="14" font-weight="700" fill="#16a34a">Total (Rule 3)</text>
  <text x="965" y="592" text-anchor="middle" font-size="13" fill="#166534">Every module MUST</text>
  <text x="965" y="610" text-anchor="middle" font-size="13" fill="#166534">be in a department</text>

  <rect x="1570" y="460" width="270" height="72" rx="10" fill="rgba(100,116,139,0.08)" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="1705" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial (Rule 4)</text>
  <text x="1705" y="508" text-anchor="middle" font-size="13" fill="#64748b">Departments CAN exist</text>
  <text x="1705" y="526" text-anchor="middle" font-size="13" fill="#64748b">with no modules yet</text>

  <!-- Legend -->
  <rect x="660" y="680" width="600" height="72" rx="10" fill="rgba(15,118,110,0.08)" stroke="rgba(45,212,191,0.2)"/>
  <line x1="700" y1="715" x2="750" y2="715" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="700" y1="721" x2="750" y2="721" stroke="#16a34a" stroke-width="2.5"/>
  <text x="766" y="720" font-size="14" fill="#5eead4">Double line = Total (mandatory)</text>
  <line x1="950" y1="718" x2="1000" y2="718" stroke="#94a3b8" stroke-width="2"/>
  <text x="1016" y="720" font-size="14" fill="#94a3b8">Single line = Partial (optional)</text>
</svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ref",label:"18 Symbol Reference",html:`<div class="ref-inner">
  <h2 class="a1">Chen's Notation — Complete Symbol Reference</h2>
  <div class="ref-grid">
    <div class="ref-card a2">
      <div class="ref-name">Entity</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><rect x="10" y="8" width="140" height="44" rx="4" fill="white" stroke="#134e4a" stroke-width="2.5"/><text x="80" y="35" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" font-weight="700" fill="#042f2e">ENTITY</text></svg>
      <div class="ref-desc">Rectangle. Represents a real-world object or concept.</div>
    </div>
    <div class="ref-card a2">
      <div class="ref-name">Key Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#64748b" stroke-width="2"/><text x="80" y="29" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" font-weight="600" fill="#042f2e" text-decoration="underline">KeyAttr</text></svg>
      <div class="ref-desc">Ellipse with underlined text. Uniquely identifies each entity instance.</div>
    </div>
    <div class="ref-card a2">
      <div class="ref-name">Simple Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#64748b" stroke-width="2"/><text x="80" y="37" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#374151">Attribute</text></svg>
      <div class="ref-desc">Plain ellipse. Holds a single, indivisible value.</div>
    </div>
    <div class="ref-card a3">
      <div class="ref-name">Composite Attribute</div>
      <svg viewBox="0 0 160 80" style="height:60px;width:auto">
        <ellipse cx="80" cy="52" rx="68" ry="24" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
        <text x="80" y="57" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" font-weight="700" fill="#0f766e">Composite</text>
        <line x1="44" y1="30" x2="26" y2="12" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="20" cy="8" rx="24" ry="10" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <line x1="80" y1="28" x2="80" y2="12" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="80" cy="8" rx="24" ry="10" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <line x1="116" y1="30" x2="134" y2="12" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="140" cy="8" rx="24" ry="10" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      </svg>
      <div class="ref-desc">Outer teal ellipse with branching smaller ellipses for sub-attributes.</div>
    </div>
    <div class="ref-card a3">
      <div class="ref-name">Multivalued Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#b45309" stroke-width="2"/><ellipse cx="80" cy="32" rx="58" ry="16" fill="#fef9c3" stroke="#b45309" stroke-width="2"/><text x="80" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e">{MultiValue}</text></svg>
      <div class="ref-desc">Double ellipse. Holds multiple values simultaneously.</div>
    </div>
    <div class="ref-card a3">
      <div class="ref-name">Derived Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#64748b" stroke-width="2" stroke-dasharray="7,4"/><text x="80" y="37" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#64748b">(Derived)</text></svg>
      <div class="ref-desc">Dashed ellipse. Computed from other data — never stored.</div>
    </div>
    <div class="ref-card a4">
      <div class="ref-name">Relationship</div>
      <svg viewBox="0 0 160 70" style="height:52px;width:auto"><polygon points="80,6 150,36 80,66 10,36" fill="white" stroke="#b45309" stroke-width="2.5"/><text x="80" y="40" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#7c2d12">rel_name</text></svg>
      <div class="ref-desc">Diamond. Links two or more entity types.</div>
    </div>
    <div class="ref-card a4">
      <div class="ref-name">Weak Entity</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><rect x="6" y="4" width="148" height="52" rx="4" fill="none" stroke="#4c1d95" stroke-width="2"/><rect x="14" y="10" width="132" height="40" rx="2" fill="white" stroke="#4c1d95" stroke-width="2"/><text x="80" y="35" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" font-weight="700" fill="#3b0764">WEAK</text></svg>
      <div class="ref-desc">Double rectangle. Cannot exist without its identifying entity.</div>
    </div>
    <div class="ref-card a4">
      <div class="ref-name">Total Participation</div>
      <svg viewBox="0 0 160 40" style="height:32px;width:auto">
        <line x1="10" y1="14" x2="150" y2="14" stroke="#16a34a" stroke-width="2.5"/>
        <line x1="10" y1="22" x2="150" y2="22" stroke="#16a34a" stroke-width="2.5"/>
        <text x="80" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#16a34a">══ double line</text>
      </svg>
      <div class="ref-desc">Double line. Every entity must participate (mandatory).</div>
    </div>
    <div class="ref-card a5">
      <div class="ref-name">Partial Participation</div>
      <svg viewBox="0 0 160 40" style="height:32px;width:auto">
        <line x1="10" y1="18" x2="150" y2="18" stroke="#94a3b8" stroke-width="2"/>
        <text x="80" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#94a3b8">── single line</text>
      </svg>
      <div class="ref-desc">Single line (default). Some entities may not participate (optional).</div>
    </div>
    <div class="ref-card a5">
      <div class="ref-name">Identifying Relationship</div>
      <svg viewBox="0 0 160 70" style="height:52px;width:auto"><polygon points="80,6 148,36 80,66 12,36" fill="none" stroke="#4c1d95" stroke-width="2.5"/><polygon points="80,16 136,36 80,56 24,36" fill="white" stroke="#4c1d95" stroke-width="2"/><text x="80" y="40" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#3b0764">id-rel</text></svg>
      <div class="ref-desc">Double diamond. Links weak entity to its identifying entity.</div>
    </div>
    <div class="ref-card a5">
      <div class="ref-name">Relationship Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><line x1="80" y1="0" x2="80" y2="14" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,3"/><ellipse cx="80" cy="40" rx="68" ry="22" fill="white" stroke="#64748b" stroke-width="2"/><text x="80" y="44" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#374151">Grade</text></svg>
      <div class="ref-desc">Ellipse connected to diamond (dashed line). Attribute of the relationship.</div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-takeaways",label:"19 Key Takeaways",html:`<div class="takeaways-inner">
  <h2 class="a1">Key Takeaways</h2>
  <div class="takeaway-list">
    <div class="takeaway-item a2"><div class="takeaway-num">1</div><p>A <strong>composite attribute</strong> has sub-attributes — draw as an outer teal ellipse with smaller ellipses branching off it via lines.</p></div>
    <div class="takeaway-item a3"><div class="takeaway-num">2</div><p>Sub-attributes represent <strong>individually meaningful parts</strong> — e.g., City and PostCode from Address. You can query each part independently in SQL.</p></div>
    <div class="takeaway-item a4"><div class="takeaway-num">3</div><p>In SQL mapping, <strong>only the leaf sub-attributes become columns</strong>. The composite parent is never a column — it only exists in the ER diagram.</p></div>
    <div class="takeaway-item a5"><div class="takeaway-num">4</div><p><strong>Total participation (══)</strong> = every entity MUST participate. The business rule says "must", "every", or "all". Maps to NOT NULL FK in SQL.</p></div>
    <div class="takeaway-item a5" style="animation-delay:.75s"><div class="takeaway-num">5</div><p><strong>Partial participation (──)</strong> = some entities are optional. The rule says "may", "can", or "optional". The FK column allows NULL in SQL.</p></div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-end",label:"20 End",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1800" cy="200" r="380" fill="rgba(15,118,110,0.06)"/>
  <circle cx="120" cy="880" r="300" fill="rgba(45,212,191,0.04)"/>
</svg>
<div class="end-inner a1">
  <p style="font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:#134e4a;margin-bottom:28px;font-weight:700">MBI802 · ER DIAGRAMS SERIES</p>
  <h1>End of Lesson 4</h1>
  <p>Next up: ER to Relational Schema Mapping</p>
  <p class="end-note">Use the flashcards below to review key terms.</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`}],bs=[{front:"What is a composite attribute?",back:"An attribute made up of multiple sub-attributes, each holding a distinct piece of information. Example: Address = StreetNumber + StreetName + City + PostCode."},{front:"How is a composite attribute drawn in Chen's notation?",back:"An outer ellipse (the composite parent, drawn with a thicker teal border) with smaller sub-attribute ellipses connected to it by lines — like branches."},{front:"Give an example of a composite attribute in a booking system.",back:"GuestName (FirstName, LastName), CheckInAddress (StreetName, Suburb, City, PostCode), or ContactDetails (PhoneNumber, Email)."},{front:"Why break an attribute into composite sub-attributes?",back:"To allow querying or processing individual parts — e.g., sorting by LastName, filtering by City, or extracting PostCode for delivery routing."},{front:"What is the difference between composite and multivalued?",back:"Composite: ONE value split into parts (Name = First + Last). Multivalued: MULTIPLE separate values ({PhoneNumber} = 021…, 09…). Different notations and SQL mappings."},{front:"How does a composite attribute map to SQL?",back:"Each sub-attribute becomes its own column. The composite parent itself does NOT become a column. E.g., Address → street_name, city, post_code columns."},{front:"What is a participation constraint?",back:"A rule specifying whether ALL entities in an entity set (total participation) or just SOME (partial participation) must participate in at least one instance of a relationship."},{front:"What does total participation mean and how is it drawn?",back:"Every entity instance MUST participate in at least one relationship instance. Drawn as a DOUBLE LINE (══) between the entity and the relationship diamond."},{front:"What does partial participation mean and how is it drawn?",back:"Some entity instances do NOT have to participate in any relationship instance. Drawn as a SINGLE LINE (──) — the default notation."},{front:'A business rule says "Every ORDER must belong to a CUSTOMER". What participation does ORDER have?',back:"Total participation — drawn as a double line from ORDER to the places/belongs_to relationship diamond. Maps to NOT NULL FK in SQL."},{front:'A business rule says "A CUSTOMER may or may not have placed an ORDER". What participation does CUSTOMER have?',back:"Partial participation — drawn as a single line (default) from CUSTOMER to the relationship diamond. The FK column in ORDER allows NULL."},{front:"How do you identify total vs. partial participation from a business rule?",back:'Total: key words are "must", "every", "all", "required", "always". Partial: key words are "may", "can", "optional", "might", "not necessarily".'}];function vs(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),[A,N]=a.useState({}),z=a.useRef(null),M=a.useRef(null),S=$e.length;a.useEffect(()=>{const d="ecp-deck-styles";if(!document.getElementById(d)){const l=document.createElement("style");l.id=d,l.textContent=ys,document.head.appendChild(l)}return()=>{const l=document.getElementById(d);l&&l.remove()}},[]),a.useEffect(()=>{const d=z.current,l=M.current;if(!d||!l)return;const c=new ResizeObserver(()=>{const{width:b,height:v}=d.getBoundingClientRect(),E=Math.min(b/1920,v/1080);l.style.transform=`scale(${E})`,l.style.transformOrigin="top left",d.style.height=`${1080*E}px`});return c.observe(d),()=>c.disconnect()},[]),a.useEffect(()=>{const d=l=>{(l.key==="ArrowRight"||l.key==="ArrowDown")&&r(c=>Math.min(c+1,S-1)),(l.key==="ArrowLeft"||l.key==="ArrowUp")&&r(c=>Math.max(c-1,0)),l.key==="Escape"&&s&&f()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[s,S]),a.useEffect(()=>{const d=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",d),()=>document.removeEventListener("fullscreenchange",d)},[]);function D(){z.current?.requestFullscreen?.()}function f(){document.exitFullscreen?.()}const g=$e[t];return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r(d=>Math.max(d-1,0)),disabled:t===0,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(45,212,191,0.3)"},children:e.jsx(le,{size:18})}),e.jsxs("span",{className:"text-sm font-medium text-gray-600 min-w-[80px] text-center",children:[t+1," / ",S]}),e.jsx("button",{onClick:()=>r(d=>Math.min(d+1,S-1)),disabled:t===S-1,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(45,212,191,0.3)"},children:e.jsx(X,{size:18})})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400 hidden sm:block",children:g.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>h(d=>!d),className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(45,212,191,0.3)"},title:o?"Collapse":"Expand",children:o?e.jsx(ie,{size:16}):e.jsx(ae,{size:16})}),e.jsx("button",{onClick:s?f:D,className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(45,212,191,0.3)"},title:s?"Exit fullscreen":"Fullscreen",children:s?e.jsx(oe,{size:16}):e.jsx(re,{size:16})})]})]}),e.jsx("div",{ref:z,className:"ecp relative w-full overflow-hidden rounded-xl",style:{border:"1px solid rgba(45,212,191,0.3)"},children:e.jsx("div",{ref:M,style:{width:1920,height:1080},children:e.jsx("section",{className:g.classes,dangerouslySetInnerHTML:{__html:g.html}})})}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1.5",children:$e.map((d,l)=>e.jsx("button",{onClick:()=>r(l),title:d.label,className:"rounded-full transition-all",style:{width:l===t?24:8,height:8,background:l===t?"#0f766e":"rgba(15,118,110,0.25)"}},l))}),e.jsxs("div",{className:"mt-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("div",{style:{width:4,height:24,borderRadius:2,background:"#0f766e",flexShrink:0}}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"Flashcards"}),e.jsx("span",{className:"text-sm text-gray-400",children:"· Click a card to flip"}),e.jsx("button",{onClick:()=>N({}),className:"ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{color:"#0f766e",borderColor:"rgba(15,118,110,0.3)"},children:"Reset all"})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:16},children:bs.map((d,l)=>e.jsx("div",{onClick:()=>N(c=>({...c,[l]:!c[l]})),style:{cursor:"pointer",perspective:1e3,height:170},children:e.jsxs("div",{style:{position:"relative",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)",transform:A[l]?"rotateY(180deg)":"rotateY(0deg)"},children:[e.jsxs("div",{style:{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"white",borderRadius:12,padding:"18px 22px",border:"1.5px solid rgba(15,118,110,0.2)",display:"flex",flexDirection:"column",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"},children:[e.jsx("div",{style:{fontSize:11,color:"#0f766e",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10},children:"Question"}),e.jsx("p",{style:{fontSize:14,color:"#1e293b",lineHeight:1.55,flex:1},children:d.front}),e.jsx("div",{style:{fontSize:11,color:"#5eead4",marginTop:8,textAlign:"right"},children:"Tap to reveal ›"})]}),e.jsxs("div",{style:{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"#f0fdfa",borderRadius:12,padding:"18px 22px",border:"1.5px solid rgba(15,118,110,0.35)",display:"flex",flexDirection:"column",transform:"rotateY(180deg)",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"},children:[e.jsx("div",{style:{fontSize:11,color:"#0f766e",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10},children:"Answer"}),e.jsx("p",{style:{fontSize:14,color:"#134e4a",lineHeight:1.55,flex:1},children:d.back})]})]})},l))})]})]})}const us=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

@keyframes ermFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes ermFadeIn { from { opacity:0; } to { opacity:1; } }
.erm .a1 { animation: ermFadeUp 0.5s ease forwards; }
.erm .a2 { animation: ermFadeUp 0.5s 0.15s ease forwards; opacity:0; }
.erm .a3 { animation: ermFadeUp 0.5s 0.30s ease forwards; opacity:0; }
.erm .a4 { animation: ermFadeUp 0.5s 0.45s ease forwards; opacity:0; }
.erm .a5 { animation: ermFadeUp 0.5s 0.60s ease forwards; opacity:0; }

.erm *{box-sizing:border-box;margin:0;padding:0}
.erm{font-family:'DM Sans',sans-serif}
.erm section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.erm .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none;color:rgba(255,255,255,.35)}
.erm .concept-body{display:flex;flex:1;min-height:0}
.erm .concept-left{width:790px;flex-shrink:0;padding:72px 68px 72px 96px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(255,255,255,.08)}
.erm .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:#130d36}
.erm .mono{font-family:'DM Mono',monospace}
.erm .act-body{display:flex;height:100%}
.erm .act-left{width:840px;flex-shrink:0;padding:66px 74px 66px 90px;display:flex;flex-direction:column;border-right:1px solid #e0d9f5}
.erm .act-right{flex:1;display:flex;align-items:center;justify-content:center;padding:52px}

.erm .s-title{background:#1e1b4b;justify-content:center;align-items:center}
.erm .s-title .inner{text-align:center;z-index:1}
.erm .s-title .eyebrow{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;margin-bottom:28px;font-weight:600}
.erm .s-title h1{font-size:92px;color:#f8fafc;line-height:1.0;margin-bottom:28px;font-weight:700}
.erm .s-title h1 span{color:#a78bfa}
.erm .s-title .amber-bar{width:100px;height:4px;background:#d97706;margin:0 auto 28px;border-radius:2px}
.erm .s-title .sub{font-size:24px;color:#a78bfa;font-weight:300;letter-spacing:.02em}

.erm .s-agenda{background:#1e1b4b}
.erm .agenda-inner{padding:80px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.erm .agenda-inner .eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;margin-bottom:20px;font-weight:700}
.erm .agenda-inner h2{font-size:56px;color:#f8fafc;font-weight:700;margin-bottom:52px}
.erm .agenda-cards{display:flex;flex-direction:column;gap:22px}
.erm .agenda-card{display:flex;align-items:flex-start;gap:28px;padding:28px 36px;border-radius:16px;background:rgba(124,58,237,.10);border:1px solid rgba(167,139,250,.18)}
.erm .agenda-num{width:52px;height:52px;border-radius:12px;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:white;flex-shrink:0}
.erm .agenda-card h3{font-size:24px;font-weight:700;color:#f1f5f9;margin-bottom:6px}
.erm .agenda-card p{font-size:17px;color:#a78bfa;line-height:1.5}

.erm .s-bigpic{background:#1e1b4b;justify-content:center;align-items:center}
.erm .s-sectionbreak{background:#1e1b4b;justify-content:center;align-items:center}
.erm .sb-watermark{position:absolute;font-size:320px;font-weight:800;color:rgba(167,139,250,.06);line-height:1;pointer-events:none;user-select:none;bottom:-40px;right:80px}
.erm .sb-inner{text-align:center;z-index:1}
.erm .sb-eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;margin-bottom:18px;font-weight:700}
.erm .sb-inner h2{font-size:66px;font-weight:700;color:#f8fafc;margin-bottom:20px;line-height:1.1}
.erm .sb-inner p{font-size:22px;color:#6d28d9;font-weight:300}

.erm .s-concept{background:#2e1065}
.erm .concept-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px;width:fit-content;background:#4c1d95;color:#ddd6fe}
.erm .concept-left h2{font-size:50px;color:#f1f5f9;line-height:1.05;margin-bottom:18px;font-weight:700}
.erm .concept-desc{font-size:19px;color:#c4b5fd;line-height:1.75;margin-bottom:22px}
.erm .concept-desc strong{color:#f1f5f9;font-weight:700}
.erm .step-cards{display:flex;flex-direction:column;gap:12px;margin-bottom:18px}
.erm .step-card{border-radius:10px;padding:16px 20px;background:#1e1040;border-left:4px solid #7c3aed;font-size:17px;color:#ddd6fe;line-height:1.5}
.erm .step-card strong{color:#a78bfa}
.erm .warn-card{border-radius:10px;padding:16px 20px;background:#431407;border-left:4px solid #d97706;font-size:16px;color:#fde68a;line-height:1.55;margin-bottom:16px}
.erm .warn-card strong{color:#fbbf24}
.erm .tip-card{border-radius:10px;padding:16px 20px;background:#0c3b4f;border-left:4px solid #0d9488;font-size:17px;color:#a7f3d0;line-height:1.55;margin-bottom:16px}
.erm .example-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.erm .chip{padding:7px 16px;border-radius:8px;font-size:14px;font-weight:500;background:#1e1040;border:1px solid #4c1d95;color:#c4b5fd}
.erm .example-rows{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.erm .ex-row{font-size:16px;color:#c4b5fd;padding:12px 18px;background:#1e1040;border-radius:8px;border-left:3px solid #7c3aed}

.erm .s-fullwhite{background:#faf5ff}
.erm .s-fullwhite .schema-header{padding:56px 100px 32px;border-bottom:2px solid #e9d5ff;background:#fff;flex-shrink:0}
.erm .s-fullwhite .schema-header h2{font-size:44px;font-weight:700;color:#1e1b4b}
.erm .s-fullwhite .schema-header p{font-size:18px;color:#6d28d9;margin-top:6px}

.erm .s-act{background:#faf5ff}
.erm .s-act .act-left{border-right:1px solid #e0d9f5}
.erm .act-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.erm .act-left h2{font-size:40px;color:#1e1b4b;font-weight:700;line-height:1.1;margin-bottom:22px}
.erm .scenario-text{font-size:18px;color:#3b0764;line-height:1.72;margin-bottom:20px;flex:1}
.erm .scenario-text strong{color:#1e1b4b;font-weight:700}
.erm .task-box{border-radius:12px;padding:20px 24px;background:#f3e8ff;border-left:5px solid #7c3aed}
.erm .task-box .task-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7c3aed;margin-bottom:10px}
.erm .task-box p{font-size:17px;color:#3b0764;line-height:1.6}

.erm .s-ans-light{background:#f0fdf4}
.erm .ans-header{padding:0 90px;height:88px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #bbf7d0;flex-shrink:0;background:#fff}
.erm .ans-header h2{font-size:34px;font-weight:700;color:#14532d}

.erm .s-mistakes{background:#2e1065}
.erm .mistakes-inner{padding:60px 100px;display:flex;flex-direction:column;height:100%}
.erm .mistakes-inner h2{font-size:52px;font-weight:700;color:#f1f5f9;margin-bottom:40px}
.erm .mistake-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;flex:1}
.erm .mistake-pair{display:flex;flex-direction:column;gap:14px}
.erm .mk-wrong{border-radius:12px;padding:20px 24px;background:#450a0a;border-left:5px solid #ef4444;flex:1}
.erm .mk-wrong .mk-label{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ef4444;margin-bottom:8px}
.erm .mk-wrong p{font-size:17px;color:#fca5a5;line-height:1.55}
.erm .mk-right{border-radius:12px;padding:20px 24px;background:#052e16;border-left:5px solid #22c55e;flex:1}
.erm .mk-right .mk-label{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#22c55e;margin-bottom:8px}
.erm .mk-right p{font-size:17px;color:#86efac;line-height:1.55}

.erm .s-takeaways{background:#1e1b4b}
.erm .takeaways-inner{padding:72px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.erm .takeaways-inner h2{font-size:52px;font-weight:700;color:#f1f5f9;margin-bottom:40px}
.erm .takeaway-list{display:flex;flex-direction:column;gap:18px}
.erm .takeaway-item{display:flex;align-items:flex-start;gap:20px;padding:22px 28px;border-radius:14px;background:rgba(124,58,237,.10);border:1px solid rgba(167,139,250,.15)}
.erm .takeaway-num{width:38px;height:38px;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;flex-shrink:0;margin-top:1px}
.erm .takeaway-item p{font-size:19px;color:#ddd6fe;line-height:1.6}
.erm .takeaway-item strong{color:#f8fafc}

.erm .s-end{background:#1e1b4b;justify-content:center;align-items:center}
.erm .end-inner{text-align:center;z-index:1}
.erm .end-inner h1{font-size:78px;font-weight:700;color:#f8fafc;margin-bottom:24px;line-height:1.1}
.erm .end-inner p{font-size:24px;color:#a78bfa;margin-bottom:14px;font-weight:300}
.erm .end-inner .end-note{font-size:16px;color:#6d28d9;margin-top:8px}
`,Xe=[{classes:"s-title",label:"01 Title",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="erm-rg1" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="rgba(124,58,237,0.18)"/>
      <stop offset="100%" stop-color="rgba(30,27,75,0)"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#erm-rg1)"/>
  <circle cx="1720" cy="160" r="300" fill="rgba(124,58,237,0.07)"/>
  <circle cx="200" cy="900" r="260" fill="rgba(167,139,250,0.05)"/>
  <text x="1560" y="980" font-size="180" font-weight="800" fill="rgba(167,139,250,0.04)" font-family="'DM Sans',sans-serif" text-anchor="middle">ER→SQL</text>
</svg>
<div class="inner a1">
  <p class="eyebrow">DATABASE MANAGEMENT SYSTEMS · MBI802</p>
  <h1>ER to Relational<br/><span>Schema Mapping</span></h1>
  <div class="amber-bar"></div>
  <p class="sub">Lesson 5 of 5 · Translating ER diagrams into database tables</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-agenda",label:"02 Agenda",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1820" cy="100" r="350" fill="rgba(124,58,237,0.06)"/>
  <circle cx="100" cy="980" r="260" fill="rgba(167,139,250,0.04)"/>
</svg>
<div class="agenda-inner">
  <p class="eyebrow a1">What you will learn</p>
  <h2 class="a1">What You'll Learn</h2>
  <div class="agenda-cards">
    <div class="agenda-card a2">
      <div class="agenda-num">1</div>
      <div>
        <h3>The Mapping Process</h3>
        <p>ER diagrams → relational model overview — why a deterministic set of rules makes schema design reliable</p>
      </div>
    </div>
    <div class="agenda-card a3">
      <div class="agenda-num">2</div>
      <div>
        <h3>8 Mapping Rules</h3>
        <p>Strong entity, composite attribute, multivalued, 1:N, M:N, 1:1, weak entity, derived attribute</p>
      </div>
    </div>
    <div class="agenda-card a4">
      <div class="agenda-num">3</div>
      <div>
        <h3>Activities</h3>
        <p>Worked university enrolment example + practice exercise (EMPLOYEE–PROJECT) with full answer</p>
      </div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-bigpic",label:"03 The Big Picture",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="960" cy="540" r="600" fill="rgba(124,58,237,0.04)"/>
</svg>
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:60px 80px;gap:40px;z-index:1">
  <div class="a1" style="text-align:center">
    <p style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700;margin-bottom:14px">THE MAPPING PIPELINE</p>
    <h2 style="font-size:52px;font-weight:700;color:#f8fafc">From ER Diagram to Relational Tables</h2>
  </div>
  <div class="a2" style="display:flex;align-items:center;gap:32px;width:100%;max-width:1600px">
    <div style="flex:1;background:#2e1065;border:1.5px solid rgba(167,139,250,.3);border-radius:20px;padding:36px 32px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:18px">
      <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:700">Step 1</div>
      <div style="font-size:26px;font-weight:700;color:#f1f5f9;text-align:center">ER Diagram</div>
      <svg viewBox="0 0 320 200" style="width:280px;height:auto">
        <rect x="90" y="80" width="140" height="50" rx="3" fill="white" stroke="#4c1d95" stroke-width="2.5"/>
        <text x="160" y="110" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#1e1b4b" font-weight="700">STUDENT</text>
        <ellipse cx="60" cy="40" rx="52" ry="22" fill="white" stroke="#64748b" stroke-width="1.5"/>
        <text x="60" y="44" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#334155">StudentId</text>
        <line x1="90" y1="44" x2="115" y2="80" stroke="#94a3b8" stroke-width="1.5"/>
        <ellipse cx="260" cy="40" rx="52" ry="22" fill="white" stroke="#64748b" stroke-width="1.5"/>
        <text x="260" y="44" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#334155">FirstName</text>
        <line x1="236" y1="44" x2="210" y2="80" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="160,155 220,185 160,215 100,185" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
        <text x="160" y="190" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e" font-weight="700">enrols</text>
        <line x1="160" y1="130" x2="160" y2="155" stroke="#94a3b8" stroke-width="1.5"/>
      </svg>
      <p style="font-size:15px;color:#a78bfa;text-align:center;line-height:1.5">Entities, attributes, and relationships drawn using Chen's notation</p>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
      <div style="font-size:48px;color:#7c3aed;font-weight:700">▶</div>
      <div style="font-size:12px;color:#6d28d9;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Apply Rules</div>
    </div>
    <div style="flex:1;background:#2e1065;border:1.5px solid rgba(167,139,250,.3);border-radius:20px;padding:36px 32px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:14px">
      <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:700">Step 2</div>
      <div style="font-size:26px;font-weight:700;color:#f1f5f9;text-align:center">8 Mapping Rules</div>
      <div style="display:flex;flex-direction:column;gap:7px;width:100%">
        ${["1. Strong Entity → Table","2. Composite Attr → Flatten","3. Multivalued → New Table","4. 1:N → FK on N-side","5. M:N → Junction Table","6. 1:1 → FK Choice","7. Weak Entity → Composite PK","8. Derived → Do Not Store"].map(t=>`<div style="padding:7px 14px;background:#1e1040;border-radius:6px;font-size:13px;color:#ddd6fe;font-family:'DM Mono',monospace">${t}</div>`).join("")}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
      <div style="font-size:48px;color:#7c3aed;font-weight:700">▶</div>
      <div style="font-size:12px;color:#6d28d9;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Result</div>
    </div>
    <div style="flex:1;background:#2e1065;border:1.5px solid rgba(167,139,250,.3);border-radius:20px;padding:36px 32px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:18px">
      <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:700">Step 3</div>
      <div style="font-size:26px;font-weight:700;color:#f1f5f9;text-align:center">Relational Tables</div>
      <svg viewBox="0 0 280 210" style="width:260px;height:auto">
        <rect x="10" y="10" width="260" height="36" rx="3" fill="#4c1d95"/>
        <text x="140" y="32" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">STUDENT</text>
        <rect x="10" y="46" width="260" height="30" rx="0" fill="#ede9fe"/>
        <text x="24" y="65" font-family="'DM Mono',monospace" font-size="11" fill="#4c1d95" font-weight="600">🔑 student_id</text>
        <text x="240" y="65" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
        <rect x="10" y="76" width="260" height="30" fill="white"/>
        <text x="24" y="95" font-family="'DM Mono',monospace" font-size="11" fill="#1e293b">first_name</text>
        <text x="240" y="95" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR</text>
        <rect x="10" y="106" width="260" height="30" fill="#f5f3ff"/>
        <text x="24" y="125" font-family="'DM Mono',monospace" font-size="11" fill="#1e293b">last_name</text>
        <text x="240" y="125" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR</text>
        <rect x="10" y="10" width="260" height="126" rx="3" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
        <rect x="10" y="155" width="260" height="36" rx="3" fill="#4c1d95"/>
        <text x="140" y="177" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">ENROLMENT</text>
        <rect x="10" y="155" width="260" height="50" rx="3" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
      </svg>
      <p style="font-size:15px;color:#a78bfa;text-align:center;line-height:1.5">Clean, normalised SQL tables ready for implementation</p>
    </div>
  </div>
  <div class="a3" style="text-align:center;max-width:1100px">
    <p style="font-size:18px;color:#6d28d9;line-height:1.65">Every construct in an ER diagram maps to a specific relational structure by following deterministic rules.</p>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-sectionbreak",label:"04 Section Break — The 8 Rules",html:`<div class="sb-watermark">01</div>
<div class="sb-inner a1">
  <p class="sb-eyebrow">THE MAPPING RULES</p>
  <h2>8 Rules to Transform<br/>Any ER Diagram</h2>
  <p>Each rule handles a different ER construct</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"05 Rule 1 — Strong Entity → Table",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 1</div>
    <h2 class="a1">Strong Entity → Table</h2>
    <p class="concept-desc a2">Each <strong>strong entity</strong> type becomes a <strong>relational table</strong>. Every simple attribute becomes a column. The key attribute becomes the <strong>primary key (PK)</strong>.</p>
    <div class="step-cards a3">
      <div class="step-card">① Entity name → <strong>Table name</strong></div>
      <div class="step-card">② Each attribute → <strong>Column</strong></div>
      <div class="step-card">③ Key attribute → <strong>PRIMARY KEY</strong></div>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 1000 580" style="width:100%;height:100%">
      <!-- ER Side -->
      <text x="210" y="38" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <!-- StudentId key ellipse -->
      <ellipse cx="110" cy="130" rx="72" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="110" y="128" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">StudentId</text>
      <line x1="140" y1="150" x2="165" y2="220" stroke="#94a3b8" stroke-width="2"/>
      <!-- FirstName ellipse -->
      <ellipse cx="290" cy="130" rx="62" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="290" y="134" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#334155">FirstName</text>
      <line x1="283" y1="158" x2="250" y2="220" stroke="#94a3b8" stroke-width="2"/>
      <!-- LastName ellipse -->
      <ellipse cx="390" cy="240" rx="58" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="390" y="244" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#334155">LastName</text>
      <line x1="338" y1="248" x2="310" y2="255" stroke="#94a3b8" stroke-width="2"/>
      <!-- DateOfBirth ellipse -->
      <ellipse cx="155" cy="360" rx="72" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="155" y="364" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#334155">DateOfBirth</text>
      <line x1="175" y1="332" x2="200" y2="290" stroke="#94a3b8" stroke-width="2"/>
      <!-- STUDENT entity -->
      <rect x="110" y="220" width="200" height="70" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="210" y="260" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="20" fill="#1e1b4b" font-weight="700">STUDENT</text>
      <!-- Arrow -->
      <text x="475" y="285" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#7c3aed" font-weight="700">Maps to</text>
      <text x="475" y="308" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="24" fill="#7c3aed" font-weight="700">→</text>
      <!-- Table -->
      <text x="740" y="38" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">RELATIONAL TABLE</text>
      <rect x="520" y="170" width="440" height="55" fill="#4c1d95" rx="4"/>
      <text x="740" y="204" text-anchor="middle" font-family="'DM Mono',monospace" font-size="18" fill="white" font-weight="700">STUDENT</text>
      <!-- PK row -->
      <rect x="520" y="225" width="440" height="50" fill="#ede9fe"/>
      <text x="545" y="254" font-family="'DM Mono',monospace" font-size="15" fill="#4c1d95" font-weight="600">🔑 student_id</text>
      <text x="950" y="254" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">INT — PRIMARY KEY</text>
      <!-- Row 2 -->
      <rect x="520" y="275" width="440" height="50" fill="white"/>
      <text x="545" y="304" font-family="'DM Mono',monospace" font-size="15" fill="#1e293b">first_name</text>
      <text x="950" y="304" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">VARCHAR(50)</text>
      <!-- Row 3 -->
      <rect x="520" y="325" width="440" height="50" fill="#f5f3ff"/>
      <text x="545" y="354" font-family="'DM Mono',monospace" font-size="15" fill="#1e293b">last_name</text>
      <text x="950" y="354" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">VARCHAR(50)</text>
      <!-- Row 4 -->
      <rect x="520" y="375" width="440" height="50" fill="white"/>
      <text x="545" y="404" font-family="'DM Mono',monospace" font-size="15" fill="#1e293b">date_of_birth</text>
      <text x="950" y="404" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">DATE</text>
      <!-- Border -->
      <rect x="520" y="170" width="440" height="255" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"06 Rule 2 — Composite Attribute → Flatten",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 2</div>
    <h2 class="a1">Composite Attribute → Flatten</h2>
    <p class="concept-desc a2">A <strong>composite attribute</strong> is NOT stored as a single column. Instead, <strong>each sub-attribute becomes its own column</strong>. The composite parent is discarded — it exists only in the ER diagram, not in the table.</p>
    <div class="warn-card a3"><strong>NEVER</strong> create a column called <code style="background:#5c1a1a;padding:2px 6px;border-radius:4px;font-size:14px">address</code> or <code style="background:#5c1a1a;padding:2px 6px;border-radius:4px;font-size:14px">name</code> if it is composite in the ER diagram. Break it into its parts.</div>
    <div class="example-chips a4">
      <span class="chip">Address → street_name, city, post_code</span>
      <span class="chip">Name → first_name, last_name</span>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 560" style="width:100%;height:100%">
      <!-- ER side: CUSTOMER with Address composite -->
      <text x="200" y="30" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <!-- CUSTOMER entity -->
      <rect x="100" y="200" width="200" height="65" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="200" y="238" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="19" fill="#1e1b4b" font-weight="700">CUSTOMER</text>
      <!-- CustomerId key ellipse -->
      <ellipse cx="200" cy="110" rx="76" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="200" y="107" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#1e1b4b" font-weight="600" text-decoration="underline">CustomerId</text>
      <line x1="200" y1="136" x2="200" y2="200" stroke="#94a3b8" stroke-width="2"/>
      <!-- Address composite ellipse (dashed indicates composite - actually solid but parent) -->
      <ellipse cx="80" cy="350" rx="64" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="80" y="354" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#334155">Address</text>
      <line x1="100" y1="265" x2="104" y2="326" stroke="#94a3b8" stroke-width="2"/>
      <!-- Sub-attributes of Address -->
      <ellipse cx="20" cy="440" rx="58" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="20" y="444" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e">StreetName</text>
      <line x1="30" y1="376" x2="26" y2="418" stroke="#94a3b8" stroke-width="1.5"/>
      <ellipse cx="120" cy="440" rx="42" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="120" y="444" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e">City</text>
      <line x1="88" y1="374" x2="110" y2="418" stroke="#94a3b8" stroke-width="1.5"/>
      <ellipse cx="206" cy="440" rx="50" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="206" y="444" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e">PostCode</text>
      <line x1="120" y1="372" x2="186" y2="418" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Annotation bracket -->
      <text x="115" y="492" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#d97706" font-weight="600">sub-attributes</text>
      <!-- Arrow -->
      <text x="440" y="280" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#7c3aed" font-weight="700">Maps to</text>
      <text x="440" y="310" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#7c3aed" font-weight="700">→</text>
      <text x="440" y="340" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#ef4444" font-weight="700">❌ No 'address' column!</text>
      <!-- Table -->
      <text x="730" y="30" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">RELATIONAL TABLE</text>
      <rect x="530" y="120" width="420" height="48" fill="#4c1d95" rx="4"/>
      <text x="740" y="150" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">CUSTOMER</text>
      <rect x="530" y="168" width="420" height="44" fill="#ede9fe"/>
      <text x="550" y="194" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 customer_id</text>
      <text x="942" y="194" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="530" y="212" width="420" height="44" fill="white"/>
      <text x="550" y="238" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">street_name</text>
      <text x="942" y="238" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(100)</text>
      <rect x="530" y="256" width="420" height="44" fill="#f5f3ff"/>
      <text x="550" y="282" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">city</text>
      <text x="942" y="282" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(60)</text>
      <rect x="530" y="300" width="420" height="44" fill="white"/>
      <text x="550" y="326" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">post_code</text>
      <text x="942" y="326" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(10)</text>
      <rect x="530" y="120" width="420" height="224" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- Crossed out 'address' column -->
      <rect x="530" y="390" width="420" height="44" fill="#fee2e2" rx="4"/>
      <text x="550" y="416" font-family="'DM Mono',monospace" font-size="13" fill="#ef4444" text-decoration="line-through">address</text>
      <text x="942" y="416" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#ef4444">❌ WRONG</text>
      <line x1="530" y1="412" x2="950" y2="412" stroke="#ef4444" stroke-width="2.5"/>
      <rect x="530" y="390" width="420" height="44" fill="none" stroke="#ef4444" stroke-width="1.5" rx="4"/>
      <!-- Brace annotation -->
      <line x1="952" y1="212" x2="968" y2="212" stroke="#d97706" stroke-width="1.5"/>
      <line x1="952" y1="344" x2="968" y2="344" stroke="#d97706" stroke-width="1.5"/>
      <line x1="968" y1="212" x2="968" y2="344" stroke="#d97706" stroke-width="1.5"/>
      <line x1="968" y1="278" x2="980" y2="278" stroke="#d97706" stroke-width="1.5"/>
      <text x="983" y="270" font-family="'DM Sans',sans-serif" font-size="11" fill="#d97706" font-weight="700">Flattened</text>
      <text x="983" y="284" font-family="'DM Sans',sans-serif" font-size="11" fill="#d97706" font-weight="700">from</text>
      <text x="983" y="298" font-family="'DM Sans',sans-serif" font-size="11" fill="#d97706" font-weight="700">Address</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"07 Rule 3 — Multivalued → New Table",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 3</div>
    <h2 class="a1">Multivalued Attribute → New Table</h2>
    <p class="concept-desc a2">A <strong>multivalued attribute</strong> (drawn as double ellipse) creates a <strong>new table</strong>. The new table has: the multivalued attribute as a column, a foreign key to the original entity, and a composite primary key.</p>
    <div class="step-cards a3">
      <div class="step-card">① Create a new table named after the attribute</div>
      <div class="step-card">② Add the original entity's PK as a <strong>FK</strong></div>
      <div class="step-card">③ PK = <strong>(entity_pk + attribute_value)</strong> — composite</div>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 540" style="width:100%;height:100%">
      <!-- ER side -->
      <text x="190" y="28" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="90" y="200" width="200" height="65" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="190" y="238" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="19" fill="#1e1b4b" font-weight="700">MEMBER</text>
      <ellipse cx="190" cy="110" rx="72" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="190" y="107" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#1e1b4b" font-weight="600" text-decoration="underline">MemberId</text>
      <line x1="190" y1="136" x2="190" y2="200" stroke="#94a3b8" stroke-width="2"/>
      <!-- Double ellipse for PhoneNumber -->
      <ellipse cx="320" cy="340" rx="86" ry="34" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="2.5"/>
      <ellipse cx="320" cy="340" rx="72" ry="24" fill="#2e1065" stroke="#a78bfa" stroke-width="2"/>
      <text x="320" y="344" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#ddd6fe" font-weight="600">{PhoneNumber}</text>
      <line x1="240" y1="262" x2="296" y2="308" stroke="#a78bfa" stroke-width="2"/>
      <!-- Arrow -->
      <text x="480" y="275" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#7c3aed" font-weight="700">Maps to</text>
      <text x="480" y="300" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#7c3aed" font-weight="700">→</text>
      <!-- MEMBER table -->
      <rect x="560" y="100" width="380" height="44" fill="#4c1d95" rx="4"/>
      <text x="750" y="127" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">MEMBER</text>
      <rect x="560" y="144" width="380" height="40" fill="#ede9fe"/>
      <text x="576" y="168" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 member_id</text>
      <text x="932" y="168" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="560" y="184" width="380" height="40" fill="white"/>
      <text x="576" y="208" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">member_name</text>
      <text x="932" y="208" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR</text>
      <rect x="560" y="100" width="380" height="124" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrow between tables -->
      <line x1="750" y1="370" x2="750" y2="340" stroke="#0d9488" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#ermArrow)"/>
      <line x1="750" y1="228" x2="750" y2="300" stroke="#0d9488" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="758" y="268" font-family="'DM Sans',sans-serif" font-size="11" fill="#0d9488">FK ref</text>
      <!-- MEMBER_PHONE table -->
      <rect x="560" y="340" width="380" height="44" fill="#4c1d95" rx="4"/>
      <text x="750" y="367" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">MEMBER_PHONE</text>
      <rect x="560" y="384" width="380" height="40" fill="#ede9fe"/>
      <text x="576" y="408" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑🔗 member_id</text>
      <text x="932" y="408" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK+FK</text>
      <rect x="560" y="424" width="380" height="40" fill="#f5f3ff"/>
      <text x="576" y="448" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 phone_number</text>
      <text x="932" y="448" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR PK</text>
      <rect x="560" y="340" width="380" height="124" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- Label -->
      <rect x="558" y="480" width="384" height="36" rx="6" fill="#1e1040"/>
      <text x="750" y="503" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa">PK = (member_id + phone_number) — composite</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"08 Rule 4 — 1:N Relationship → FK",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 4</div>
    <h2 class="a1">1:N Relationship → FK on N-side</h2>
    <p class="concept-desc a2">In a 1:N relationship, the <strong>primary key of the '1' entity</strong> is added as a <strong>foreign key in the 'N' entity's table</strong>. No new table is needed.</p>
    <div class="tip-card a3">Memory tip: The FK always goes to the <strong>MANY side</strong> — where there are many instances, each pointing back to one.</div>
    <div class="example-rows a4">
      <div class="ex-row">DEPARTMENT (1) ── employs ──► EMPLOYEE (N)<br/><span style="color:#0d9488;font-size:13px;margin-top:4px;display:block">→ dept_id FK added to EMPLOYEE table</span></div>
      <div class="ex-row">CUSTOMER (1) ── places ──► ORDER (N)<br/><span style="color:#0d9488;font-size:13px;margin-top:4px;display:block">→ customer_id FK added to ORDER table</span></div>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 560" style="width:100%;height:100%">
      <!-- ER diagram top -->
      <text x="370" y="28" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="30" y="160" width="190" height="62" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="125" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">DEPARTMENT</text>
      <line x1="220" y1="191" x2="268" y2="191" stroke="#94a3b8" stroke-width="2"/>
      <text x="258" y="184" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">1</text>
      <polygon points="340,163 420,191 340,219 260,191" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="340" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#92400e" font-weight="700">employs</text>
      <line x1="420" y1="191" x2="466" y2="191" stroke="#94a3b8" stroke-width="2"/>
      <text x="428" y="184" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">N</text>
      <rect x="466" y="160" width="190" height="62" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="561" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">EMPLOYEE</text>
      <!-- Arrow down -->
      <text x="370" y="270" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#7c3aed" font-weight="700">Maps to ▼</text>
      <!-- DEPARTMENT table -->
      <rect x="30" y="310" width="380" height="44" fill="#4c1d95" rx="4"/>
      <text x="220" y="337" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">DEPARTMENT</text>
      <rect x="30" y="354" width="380" height="40" fill="#ede9fe"/>
      <text x="48" y="378" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 dept_id</text>
      <text x="402" y="378" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="30" y="394" width="380" height="40" fill="white"/>
      <text x="48" y="418" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">dept_name</text>
      <text x="402" y="418" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(80)</text>
      <rect x="30" y="310" width="380" height="124" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- EMPLOYEE table -->
      <rect x="560" y="310" width="400" height="44" fill="#4c1d95" rx="4"/>
      <text x="760" y="337" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">EMPLOYEE</text>
      <rect x="560" y="354" width="400" height="40" fill="#ede9fe"/>
      <text x="578" y="378" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 employee_id</text>
      <text x="952" y="378" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="560" y="394" width="400" height="40" fill="white"/>
      <text x="578" y="418" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">first_name</text>
      <text x="952" y="418" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR</text>
      <rect x="560" y="434" width="400" height="40" fill="#e0f2fe"/>
      <text x="578" y="458" font-family="'DM Mono',monospace" font-size="13" fill="#0369a1" font-weight="600">🔗 dept_id</text>
      <text x="952" y="458" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#0369a1">INT FK → DEPARTMENT</text>
      <rect x="560" y="310" width="400" height="164" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrow -->
      <line x1="410" y1="362" x2="558" y2="452" stroke="#0d9488" stroke-width="2" stroke-dasharray="7,4"/>
      <text x="484" y="415" font-family="'DM Sans',sans-serif" font-size="12" fill="#0d9488" font-weight="600">FK ref</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"09 Rule 5 — M:N → Junction Table",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 5</div>
    <h2 class="a1">M:N Relationship → Junction Table</h2>
    <p class="concept-desc a2">A <strong>many-to-many relationship</strong> cannot be represented with a single FK. Instead, create a <strong>new junction (bridge) table</strong> containing the PKs of BOTH entities as foreign keys. Relationship attributes become columns in this table.</p>
    <div class="step-card a3" style="margin-bottom:12px">The junction table's PK is typically the <strong>combination of both FKs</strong> (composite PK).</div>
    <div class="tip-card a3">Example: STUDENT enrolls in MODULE — the Grade attribute belongs to the ENROLMENT junction table, not to STUDENT or MODULE alone.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 540" style="width:100%;height:100%">
      <!-- ER diagram -->
      <text x="370" y="26" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="20" y="130" width="170" height="58" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="105" y="164" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">STUDENT</text>
      <line x1="190" y1="159" x2="238" y2="159" stroke="#94a3b8" stroke-width="2"/>
      <text x="228" y="152" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">M</text>
      <polygon points="310,131 390,159 310,187 230,159" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="310" y="154" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e" font-weight="700">enrols_in</text>
      <text x="310" y="168" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="#92400e">Grade ◆</text>
      <line x1="390" y1="159" x2="438" y2="159" stroke="#94a3b8" stroke-width="2"/>
      <text x="398" y="152" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">N</text>
      <rect x="438" y="130" width="170" height="58" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="523" y="164" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">MODULE</text>
      <!-- Arrow -->
      <text x="370" y="232" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#7c3aed" font-weight="700">Maps to ▼  (3 tables)</text>
      <!-- STUDENT table -->
      <rect x="20" y="268" width="270" height="40" fill="#4c1d95" rx="4"/>
      <text x="155" y="292" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">STUDENT</text>
      <rect x="20" y="308" width="270" height="36" fill="#ede9fe"/>
      <text x="36" y="330" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 student_id</text>
      <text x="282" y="330" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
      <rect x="20" y="344" width="270" height="36" fill="white"/>
      <text x="36" y="366" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">first_name</text>
      <rect x="20" y="268" width="270" height="112" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- MODULE table -->
      <rect x="680" y="268" width="280" height="40" fill="#4c1d95" rx="4"/>
      <text x="820" y="292" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">MODULE</text>
      <rect x="680" y="308" width="280" height="36" fill="#ede9fe"/>
      <text x="696" y="330" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 module_code</text>
      <text x="952" y="330" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR PK</text>
      <rect x="680" y="344" width="280" height="36" fill="white"/>
      <text x="696" y="366" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">module_name</text>
      <rect x="680" y="268" width="280" height="112" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- ENROLMENT table (junction) -->
      <rect x="310" y="370" width="360" height="40" fill="#4c1d95" rx="4"/>
      <text x="490" y="394" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">ENROLMENT</text>
      <rect x="310" y="410" width="360" height="36" fill="#ede9fe"/>
      <text x="326" y="432" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔑🔗 student_id</text>
      <text x="662" y="432" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">INT PK+FK</text>
      <rect x="310" y="446" width="360" height="36" fill="#f5f3ff"/>
      <text x="326" y="468" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔑🔗 module_code</text>
      <text x="662" y="468" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">VARCHAR PK+FK</text>
      <rect x="310" y="482" width="360" height="36" fill="white"/>
      <text x="326" y="504" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">grade</text>
      <text x="662" y="504" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">DECIMAL(4,2)</text>
      <rect x="310" y="370" width="360" height="148" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrows -->
      <line x1="155" y1="380" x2="350" y2="420" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="5,3"/>
      <line x1="820" y1="380" x2="640" y2="420" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="5,3"/>
      <!-- Label -->
      <rect x="380" y="528" width="220" height="24" rx="4" fill="#1e1040"/>
      <text x="490" y="544" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#a78bfa">Junction table resolves M:N</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"10 Rule 6 — 1:1 Relationship → FK Choice",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 6</div>
    <h2 class="a1">1:1 Relationship → FK Choice</h2>
    <p class="concept-desc a2">In a 1:1 relationship, add the FK in <strong>either table</strong>. Best practice: put the FK on the <strong>total-participation side</strong> (mandatory side), or the side that 'belongs to' the other. Alternatively, merge both entities into one table if they always co-exist.</p>
    <div class="step-cards a3">
      <div class="step-card"><strong>Option A:</strong> Add FK in the total-participation side table</div>
      <div class="step-card"><strong>Option B:</strong> Merge both entities into one table (if always co-exist)</div>
    </div>
    <div class="tip-card a4">Example: EMPLOYEE (1) ── assigned ── (1) COMPANY_CAR. Not every employee has a car, but every company car is assigned to one employee → put employee_id FK in COMPANY_CAR table (total participation side).</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 520" style="width:100%;height:100%">
      <!-- ER -->
      <text x="370" y="26" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="20" y="120" width="190" height="60" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="115" y="155" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">EMPLOYEE</text>
      <line x1="210" y1="150" x2="256" y2="150" stroke="#94a3b8" stroke-width="2"/>
      <text x="246" y="142" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">1</text>
      <polygon points="328,122 408,150 328,178 248,150" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="328" y="155" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e" font-weight="700">assigned</text>
      <line x1="408" y1="150" x2="452" y2="150" stroke="#94a3b8" stroke-width="2"/>
      <text x="414" y="142" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">1</text>
      <rect x="452" y="120" width="220" height="60" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="562" y="148" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#1e1b4b" font-weight="700">COMPANY_CAR</text>
      <text x="562" y="168" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#6d28d9">(total participation)</text>
      <!-- double line on car side to indicate total participation -->
      <line x1="452" y1="143" x2="412" y2="151" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="455" y1="157" x2="412" y2="151" stroke="#94a3b8" stroke-width="2.5"/>
      <!-- Arrow -->
      <text x="370" y="226" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#7c3aed" font-weight="700">Option A: FK on COMPANY_CAR side ▼</text>
      <!-- EMPLOYEE table -->
      <rect x="20" y="258" width="320" height="40" fill="#4c1d95" rx="4"/>
      <text x="180" y="282" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">EMPLOYEE</text>
      <rect x="20" y="298" width="320" height="38" fill="#ede9fe"/>
      <text x="36" y="321" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 employee_id</text>
      <text x="332" y="321" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
      <rect x="20" y="336" width="320" height="38" fill="white"/>
      <text x="36" y="359" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">employee_name</text>
      <rect x="20" y="258" width="320" height="116" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- COMPANY_CAR table -->
      <rect x="560" y="258" width="400" height="40" fill="#4c1d95" rx="4"/>
      <text x="760" y="282" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">COMPANY_CAR</text>
      <rect x="560" y="298" width="400" height="38" fill="#ede9fe"/>
      <text x="576" y="321" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 car_reg</text>
      <text x="952" y="321" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR PK</text>
      <rect x="560" y="336" width="400" height="38" fill="white"/>
      <text x="576" y="359" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">car_model</text>
      <rect x="560" y="374" width="400" height="38" fill="#e0f2fe"/>
      <text x="576" y="397" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔗 employee_id</text>
      <text x="952" y="397" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">INT FK → EMPLOYEE</text>
      <rect x="560" y="258" width="400" height="154" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK line -->
      <line x1="340" y1="316" x2="558" y2="392" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="6,3"/>
      <text x="448" y="356" font-family="'DM Sans',sans-serif" font-size="12" fill="#0d9488">FK ref</text>
      <!-- Option B note -->
      <rect x="20" y="440" width="940" height="48" rx="8" fill="#1e1040"/>
      <text x="480" y="462" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#a78bfa" font-weight="700">Option B: Merge into one table → EMPLOYEE_CAR(employee_id PK, employee_name, car_reg, car_model)</text>
      <text x="480" y="480" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#6d28d9">Use only when every employee ALWAYS has a car (both sides are total participation)</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"11 Rule 7 — Weak Entity → Composite PK",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 7</div>
    <h2 class="a1">Weak Entity → Composite PK</h2>
    <p class="concept-desc a2">A <strong>weak entity</strong> becomes a table with a <strong>composite primary key</strong> = the partial key (discriminator) + the identifying entity's PK (as FK). The identifying entity's PK serves double duty as both FK and part of PK.</p>
    <div class="step-cards a3">
      <div class="step-card">① Identifying entity's PK → column in weak entity table (as FK)</div>
      <div class="step-card">② Partial key → column in weak entity table</div>
      <div class="step-card">③ PK of new table = <strong>(identifying_pk + partial_key)</strong></div>
    </div>
    <div class="tip-card a4">ROOM (partial key: RoomNo) identified by BUILDING (PK: BuildingId) → ROOM table PK = (building_id, room_no)</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 520" style="width:100%;height:100%">
      <!-- ER diagram -->
      <text x="370" y="26" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <!-- BUILDING (strong) -->
      <rect x="20" y="130" width="190" height="60" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="115" y="165" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">BUILDING</text>
      <!-- BuildingId ellipse (key) -->
      <ellipse cx="115" cy="56" rx="76" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="115" y="53" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#1e1b4b" font-weight="600" text-decoration="underline">BuildingId</text>
      <line x1="115" y1="82" x2="115" y2="130" stroke="#94a3b8" stroke-width="2"/>
      <!-- double diamond -->
      <line x1="210" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="332,128 412,160 332,192 252,160" fill="none" stroke="#d97706" stroke-width="3"/>
      <polygon points="332,140 400,160 332,180 264,160" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="332" y="165" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e" font-weight="700">located_in</text>
      <line x1="412" y1="160" x2="460" y2="160" stroke="#94a3b8" stroke-width="2"/>
      <!-- ROOM (weak, double rect) -->
      <rect x="458" y="126" width="200" height="68" rx="4" fill="none" stroke="#4c1d95" stroke-width="3"/>
      <rect x="468" y="136" width="180" height="48" rx="3" fill="white" stroke="#4c1d95" stroke-width="1.5"/>
      <text x="558" y="165" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">ROOM</text>
      <!-- RoomNo (partial key, dashed underline) -->
      <ellipse cx="558" cy="56" rx="68" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="558" y="53" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#334155">RoomNo</text>
      <line x1="504" y1="62" x2="612" y2="62" stroke="#334155" stroke-width="1.5" stroke-dasharray="5,3"/>
      <line x1="558" y1="82" x2="558" y2="126" stroke="#94a3b8" stroke-width="2"/>
      <!-- Arrow -->
      <text x="370" y="240" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#7c3aed" font-weight="700">Maps to ▼</text>
      <!-- BUILDING table -->
      <rect x="20" y="270" width="360" height="40" fill="#4c1d95" rx="4"/>
      <text x="200" y="294" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">BUILDING</text>
      <rect x="20" y="310" width="360" height="38" fill="#ede9fe"/>
      <text x="36" y="333" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 building_id</text>
      <text x="372" y="333" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
      <rect x="20" y="348" width="360" height="38" fill="white"/>
      <text x="36" y="371" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">building_name</text>
      <rect x="20" y="270" width="360" height="116" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- ROOM table -->
      <rect x="560" y="270" width="400" height="40" fill="#4c1d95" rx="4"/>
      <text x="760" y="294" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">ROOM</text>
      <rect x="560" y="310" width="400" height="38" fill="#ede9fe"/>
      <text x="576" y="333" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔑🔗 building_id</text>
      <text x="952" y="333" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">INT PK + FK</text>
      <rect x="560" y="348" width="400" height="38" fill="#f5f3ff"/>
      <text x="576" y="371" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 room_no</text>
      <text x="952" y="371" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK (partial key)</text>
      <rect x="560" y="386" width="400" height="38" fill="white"/>
      <text x="576" y="409" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">room_type</text>
      <text x="952" y="409" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR</text>
      <rect x="560" y="270" width="400" height="154" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrow -->
      <line x1="380" y1="320" x2="558" y2="330" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="6,3"/>
      <!-- PK annotation -->
      <rect x="560" y="434" width="400" height="36" rx="6" fill="#1e1040"/>
      <text x="760" y="456" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#a78bfa">PK = (building_id, room_no) — composite</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"12 Rule 8 — Derived Attribute → Do Not Store",html:`<div style="padding:48px 100px 0;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700;margin-bottom:10px">Mapping Rules</div>
  <div style="display:flex;align-items:baseline;gap:20px">
    <div style="display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:#4c1d95;color:#ddd6fe">Rule 8</div>
    <h2 style="font-size:48px;font-weight:700;color:#f1f5f9">Derived Attribute → Do NOT Store</h2>
  </div>
</div>
<div style="flex:1;padding:32px 100px 60px;display:flex;gap:40px;align-items:stretch">
  <div style="flex:1;display:flex;flex-direction:column;gap:20px">
    <p style="font-size:20px;color:#c4b5fd;line-height:1.7">Derived attributes (dashed ellipse in Chen's notation) are <strong style="color:#f1f5f9">calculated from other data</strong>. They should <strong style="color:#f1f5f9">NOT be stored</strong> as columns — they become stale and waste storage. Compute them in queries instead.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1">
      <div style="background:#450a0a;border:1.5px solid #ef4444;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ef4444">❌ WRONG</div>
        <div style="font-family:'DM Mono',monospace;font-size:16px;color:#fca5a5;background:#3b0000;padding:14px;border-radius:8px">age INT</div>
        <p style="font-size:16px;color:#fca5a5;line-height:1.55">Becomes stale the next birthday. You would need to update every row every day — impossible at scale.</p>
      </div>
      <div style="background:#052e16;border:1.5px solid #22c55e;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#22c55e">✅ CORRECT</div>
        <div style="font-family:'DM Mono',monospace;font-size:12px;color:#86efac;background:#021a0e;padding:14px;border-radius:8px;line-height:1.7">SELECT<br/>  DATEDIFF(YEAR,<br/>    date_of_birth,<br/>    GETDATE()) AS age<br/>FROM EMPLOYEE</div>
        <p style="font-size:16px;color:#86efac;line-height:1.55">Always accurate. Computed at query time from the stored date_of_birth column.</p>
      </div>
    </div>
    <div style="background:#1e1040;border-radius:10px;padding:18px 24px;border-left:4px solid #7c3aed">
      <p style="font-size:16px;color:#a78bfa;line-height:1.6">Note: Some modern systems support <strong style="color:#ddd6fe">computed/virtual columns</strong> that are calculated automatically. The default mapping rule is still to omit derived attributes from the schema.</p>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-sectionbreak",label:"13 Section — Worked Example",html:`<div class="sb-watermark">02</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">WORKED EXAMPLE</p>
  <h2 class="a2">University Enrolment System</h2>
  <p class="a3" style="font-size:22px;color:rgba(255,255,255,.38);font-weight:300;margin-top:16px">Mapping a complete ER diagram step by step</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"",label:"14 University ER Diagram",html:`<div style="position:absolute;inset:0;background:#0f172a"></div>
<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 1920 1080" font-family="'DM Sans',sans-serif">
  <text x="960" y="68" text-anchor="middle" font-size="22" font-weight="700" fill="#a78bfa" letter-spacing="0.14em">UNIVERSITY ENROLMENT — ER DIAGRAM</text>

  <!-- STUDENT entity -->
  <rect x="155" y="464" width="210" height="72" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
  <text x="260" y="506" text-anchor="middle" font-size="22" font-weight="700" fill="#1e1b4b">STUDENT</text>

  <!-- STUDENT key attribute: StudentId -->
  <line x1="210" y1="464" x2="162" y2="380" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="140" cy="358" rx="80" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="140" y="355" text-anchor="middle" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">StudentId</text>

  <!-- STUDENT: FirstName -->
  <line x1="275" y1="464" x2="295" y2="380" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="308" cy="357" rx="70" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="308" y="362" text-anchor="middle" font-size="14" fill="#374151">FirstName</text>

  <!-- STUDENT: DateOfBirth -->
  <line x1="165" y1="520" x2="90" y2="520" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="38" cy="520" rx="62" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="38" y="525" text-anchor="middle" font-size="13" fill="#374151">DateOfBirth</text>

  <!-- STUDENT: Address composite -->
  <line x1="230" y1="536" x2="220" y2="610" stroke="#0f766e" stroke-width="1.5"/>
  <ellipse cx="220" cy="638" rx="80" ry="30" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
  <text x="220" y="644" text-anchor="middle" font-size="14" font-weight="700" fill="#0f766e">Address</text>
  <line x1="168" y1="662" x2="108" y2="706" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="76" cy="726" rx="66" ry="24" fill="#e6faf8" stroke="#0f766e" stroke-width="1.5"/>
  <text x="76" y="731" text-anchor="middle" font-size="12" fill="#065f46">StreetName</text>
  <line x1="220" y1="668" x2="220" y2="712" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="220" cy="734" rx="46" ry="22" fill="#e6faf8" stroke="#0f766e" stroke-width="1.5"/>
  <text x="220" y="739" text-anchor="middle" font-size="12" fill="#065f46">City</text>
  <line x1="272" y1="662" x2="332" y2="706" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="364" cy="726" rx="66" ry="24" fill="#e6faf8" stroke="#0f766e" stroke-width="1.5"/>
  <text x="364" y="731" text-anchor="middle" font-size="12" fill="#065f46">PostCode</text>

  <!-- enrols_in diamond -->
  <polygon points="640,432 756,500 640,568 524,500" fill="#1e1040" stroke="#d97706" stroke-width="3"/>
  <text x="640" y="507" text-anchor="middle" font-size="17" font-weight="700" fill="#fbbf24">enrols_in</text>

  <!-- Grade relationship attribute -->
  <line x1="640" y1="432" x2="640" y2="385" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <ellipse cx="640" cy="360" rx="54" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="640" y="365" text-anchor="middle" font-size="14" fill="#374151">Grade</text>

  <!-- STUDENT ══ enrols_in (total participation) -->
  <line x1="365" y1="497" x2="524" y2="497" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="365" y1="503" x2="524" y2="503" stroke="#16a34a" stroke-width="2.5"/>
  <text x="444" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#16a34a">M</text>

  <!-- enrols_in ── MODULE (partial participation) -->
  <line x1="756" y1="500" x2="955" y2="500" stroke="#94a3b8" stroke-width="2"/>
  <text x="856" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#374151">N</text>

  <!-- MODULE entity -->
  <rect x="955" y="464" width="210" height="72" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
  <text x="1060" y="506" text-anchor="middle" font-size="22" font-weight="700" fill="#1e1b4b">MODULE</text>

  <!-- MODULE: ModuleCode (key) -->
  <line x1="1008" y1="464" x2="960" y2="382" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="938" cy="360" rx="78" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="938" y="357" text-anchor="middle" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">ModuleCode</text>

  <!-- MODULE: ModuleName -->
  <line x1="1100" y1="464" x2="1130" y2="382" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1150" cy="360" rx="74" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1150" y="365" text-anchor="middle" font-size="14" fill="#374151">ModuleName</text>

  <!-- MODULE: Credits -->
  <line x1="1165" y1="490" x2="1230" y2="490" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1286" cy="490" rx="56" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1286" y="495" text-anchor="middle" font-size="14" fill="#374151">Credits</text>

  <!-- belongs_to diamond -->
  <polygon points="1380,432 1496,500 1380,568 1264,500" fill="#1e1040" stroke="#d97706" stroke-width="3"/>
  <text x="1380" y="507" text-anchor="middle" font-size="16" font-weight="700" fill="#fbbf24">belongs_to</text>

  <!-- MODULE ══ belongs_to (total) -->
  <line x1="1165" y1="497" x2="1264" y2="497" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="1165" y1="503" x2="1264" y2="503" stroke="#16a34a" stroke-width="2.5"/>
  <text x="1214" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#16a34a">N</text>

  <!-- belongs_to ── DEPARTMENT (partial) -->
  <line x1="1496" y1="500" x2="1580" y2="500" stroke="#94a3b8" stroke-width="2"/>
  <text x="1538" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#374151">1</text>

  <!-- DEPARTMENT entity -->
  <rect x="1580" y="464" width="240" height="72" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
  <text x="1700" y="506" text-anchor="middle" font-size="22" font-weight="700" fill="#1e1b4b">DEPARTMENT</text>

  <!-- DEPARTMENT: DeptId (key) -->
  <line x1="1640" y1="464" x2="1610" y2="382" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1594" cy="360" rx="64" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1594" y="357" text-anchor="middle" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">DeptId</text>

  <!-- DEPARTMENT: DeptName -->
  <line x1="1780" y1="464" x2="1820" y2="384" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1840" cy="362" rx="70" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1840" y="367" text-anchor="middle" font-size="14" fill="#374151">DeptName</text>

  <!-- Legend -->
  <rect x="700" y="730" width="520" height="174" rx="12" fill="rgba(30,27,75,0.85)" stroke="rgba(167,139,250,0.25)" stroke-width="1"/>
  <text x="960" y="762" text-anchor="middle" font-size="13" font-weight="700" fill="#a78bfa" letter-spacing="0.12em">LEGEND</text>
  <line x1="728" y1="788" x2="784" y2="788" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="728" y1="794" x2="784" y2="794" stroke="#16a34a" stroke-width="2.5"/>
  <text x="798" y="795" font-size="14" fill="#e2e8f0">Double line = Total participation (mandatory)</text>
  <line x1="728" y1="822" x2="784" y2="822" stroke="#94a3b8" stroke-width="2"/>
  <text x="798" y="828" font-size="14" fill="#e2e8f0">Single line = Partial participation (optional)</text>
  <ellipse cx="756" cy="860" rx="46" ry="18" fill="#f0fdfa" stroke="#0f766e" stroke-width="2"/>
  <text x="756" y="865" text-anchor="middle" font-size="11" fill="#065f46">Composite</text>
  <text x="798" y="865" font-size="14" fill="#e2e8f0">= Composite attribute (flattened in SQL)</text>
  <line x1="728" y1="894" x2="784" y2="894" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="798" y="899" font-size="14" fill="#e2e8f0">Dashed line = Relationship attribute (Grade)</text>
</svg>
<div class="cr" style="color:rgba(255,255,255,.25);z-index:10;position:absolute">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"15 Step 1 — Map Entities to Tables",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Worked Example · Step 1 of 2</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Step 1</div>
    <h2 class="a1">Map Each Entity to a Table</h2>
    <p class="concept-desc a2">Apply <strong>Rule 1</strong> to all three entities. Each becomes a table; each attribute becomes a column; key attributes become primary keys.</p>
    <div class="step-cards a3">
      <div class="step-card">STUDENT → <strong>student</strong> table (7 columns incl. Address sub-attrs)</div>
      <div class="step-card">MODULE → <strong>module</strong> table (3 columns)</div>
      <div class="step-card">DEPARTMENT → <strong>department</strong> table (2 columns)</div>
    </div>
    <div class="tip-card a4">Address is composite → <strong>flatten</strong> to street_name, city, post_code columns. No "address" column is created.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 960 760" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- STUDENT table -->
      <rect x="10" y="20" width="290" height="44" rx="4" fill="#4c1d95"/>
      <text x="155" y="47" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">STUDENT</text>
      <rect x="10" y="64" width="290" height="40" fill="#ede9fe"/>
      <text x="25" y="89" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 student_id</text>
      <text x="294" y="89" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT  PK</text>
      <rect x="10" y="104" width="290" height="36" fill="white"/>
      <text x="25" y="127" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">first_name</text>
      <text x="294" y="127" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(50)</text>
      <rect x="10" y="140" width="290" height="36" fill="#f5f3ff"/>
      <text x="25" y="163" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">last_name</text>
      <text x="294" y="163" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(50)</text>
      <rect x="10" y="176" width="290" height="36" fill="white"/>
      <text x="25" y="199" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">date_of_birth</text>
      <text x="294" y="199" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">DATE</text>
      <rect x="10" y="212" width="290" height="36" fill="#ecfdf5"/>
      <text x="25" y="235" font-family="'DM Mono',monospace" font-size="13" fill="#065f46">street_name</text>
      <text x="294" y="235" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(80)</text>
      <rect x="10" y="248" width="290" height="36" fill="white"/>
      <text x="25" y="271" font-family="'DM Mono',monospace" font-size="13" fill="#065f46">city</text>
      <text x="294" y="271" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(50)</text>
      <rect x="10" y="284" width="290" height="36" fill="#ecfdf5"/>
      <text x="25" y="307" font-family="'DM Mono',monospace" font-size="13" fill="#065f46">post_code</text>
      <text x="294" y="307" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(10)</text>
      <rect x="10" y="20" width="290" height="300" rx="4" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
      <text x="155" y="340" text-anchor="middle" font-size="12" fill="#0f766e">⤴ Address flattened → 3 columns</text>

      <!-- MODULE table -->
      <rect x="330" y="20" width="280" height="44" rx="4" fill="#4c1d95"/>
      <text x="470" y="47" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">MODULE</text>
      <rect x="330" y="64" width="280" height="40" fill="#ede9fe"/>
      <text x="345" y="89" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 module_code</text>
      <text x="604" y="89" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR PK</text>
      <rect x="330" y="104" width="280" height="36" fill="white"/>
      <text x="345" y="127" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">module_name</text>
      <text x="604" y="127" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(100)</text>
      <rect x="330" y="140" width="280" height="36" fill="#f5f3ff"/>
      <text x="345" y="163" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">credits</text>
      <text x="604" y="163" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">INT</text>
      <rect x="330" y="176" width="280" height="36" fill="#fef9c3"/>
      <text x="345" y="199" font-family="'DM Mono',monospace" font-size="12" fill="#92400e" font-style="italic">dept_id  ← added in Step 2</text>
      <rect x="330" y="20" width="280" height="192" rx="4" fill="none" stroke="#7c3aed" stroke-width="1.5"/>

      <!-- DEPARTMENT table -->
      <rect x="640" y="20" width="290" height="44" rx="4" fill="#4c1d95"/>
      <text x="785" y="47" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">DEPARTMENT</text>
      <rect x="640" y="64" width="290" height="40" fill="#ede9fe"/>
      <text x="655" y="89" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 dept_id</text>
      <text x="924" y="89" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT  PK</text>
      <rect x="640" y="104" width="290" height="36" fill="white"/>
      <text x="655" y="127" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">dept_name</text>
      <text x="924" y="127" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(80)</text>
      <rect x="640" y="20" width="290" height="120" rx="4" fill="none" stroke="#7c3aed" stroke-width="1.5"/>

      <!-- Divider label -->
      <text x="480" y="420" text-anchor="middle" font-size="14" fill="#6d28d9" font-weight="600">Step 2 will add ENROLMENT junction table + dept_id FK to MODULE</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-concept",label:"16 Step 2 — Map Relationships",html:`<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Worked Example · Step 2 of 2</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Step 2</div>
    <h2 class="a1">Map the Relationships</h2>
    <div class="step-cards a2">
      <div class="step-card"><strong>enrols_in (M:N)</strong> → new ENROLMENT junction table<br/><span style="font-size:14px;color:#a78bfa">PK = (student_id + module_code). Grade becomes a column.</span></div>
      <div class="step-card"><strong>belongs_to (1:N)</strong> → add dept_id FK to MODULE table<br/><span style="font-size:14px;color:#a78bfa">No new table needed — FK goes on the N-side (MODULE).</span></div>
    </div>
    <div class="tip-card a3">The M:N enrols_in relationship has a relationship attribute (Grade) — it goes inside the junction table, not in STUDENT or MODULE.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 680" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- ENROLMENT junction table -->
      <text x="300" y="28" text-anchor="middle" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="0.1em">NEW — Junction Table for M:N</text>
      <rect x="40" y="40" width="520" height="44" rx="4" fill="#4c1d95"/>
      <text x="300" y="67" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">ENROLMENT</text>
      <rect x="40" y="84" width="520" height="40" fill="#e0f2fe"/>
      <text x="56" y="109" font-family="'DM Mono',monospace" font-size="13" fill="#0369a1" font-weight="600">🔑🔗 student_id</text>
      <text x="554" y="109" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#0369a1">INT  PK + FK → STUDENT</text>
      <rect x="40" y="124" width="520" height="40" fill="#dbeafe"/>
      <text x="56" y="149" font-family="'DM Mono',monospace" font-size="13" fill="#1d4ed8" font-weight="600">🔑🔗 module_code</text>
      <text x="554" y="149" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#1d4ed8">VARCHAR  PK + FK → MODULE</text>
      <rect x="40" y="164" width="520" height="40" fill="white"/>
      <text x="56" y="189" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">grade</text>
      <text x="554" y="189" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">DECIMAL(4,2)</text>
      <rect x="40" y="40" width="520" height="164" rx="4" fill="none" stroke="#7c3aed" stroke-width="2"/>
      <text x="300" y="226" text-anchor="middle" font-size="12" fill="#7c3aed">PK = (student_id, module_code) — composite primary key</text>

      <!-- MODULE table (updated) -->
      <text x="760" y="28" text-anchor="middle" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="0.1em">UPDATED — FK added</text>
      <rect x="600" y="40" width="360" height="44" rx="4" fill="#4c1d95"/>
      <text x="780" y="67" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">MODULE</text>
      <rect x="600" y="84" width="360" height="38" fill="#ede9fe"/>
      <text x="615" y="107" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 module_code</text>
      <text x="954" y="107" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR PK</text>
      <rect x="600" y="122" width="360" height="36" fill="white"/>
      <text x="615" y="145" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">module_name</text>
      <rect x="600" y="158" width="360" height="36" fill="#f5f3ff"/>
      <text x="615" y="181" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">credits</text>
      <rect x="600" y="194" width="360" height="38" fill="#e0f2fe"/>
      <text x="615" y="217" font-family="'DM Mono',monospace" font-size="13" fill="#0369a1" font-weight="600">🔗 dept_id</text>
      <text x="954" y="217" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#0369a1">INT  FK → DEPARTMENT</text>
      <rect x="600" y="40" width="360" height="192" rx="4" fill="none" stroke="#7c3aed" stroke-width="2"/>

      <!-- FK arrows summary -->
      <rect x="40" y="290" width="920" height="130" rx="12" fill="rgba(30,27,75,0.6)" stroke="rgba(167,139,250,0.2)"/>
      <text x="500" y="320" text-anchor="middle" font-size="14" font-weight="700" fill="#a78bfa" letter-spacing="0.08em">FOREIGN KEY SUMMARY</text>
      <text x="80" y="352" font-size="14" fill="#c4b5fd">ENROLMENT.student_id  →  STUDENT.student_id</text>
      <text x="80" y="378" font-size="14" fill="#c4b5fd">ENROLMENT.module_code  →  MODULE.module_code</text>
      <text x="80" y="404" font-size="14" fill="#c4b5fd">MODULE.dept_id  →  DEPARTMENT.dept_id</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-fullwhite",label:"17 Complete Relational Schema",html:`<div class="schema-header">
  <h2>Complete Relational Schema</h2>
  <p>4 tables — 3 entities + 1 junction table for the M:N relationship</p>
</div>
<div style="flex:1;padding:24px 60px 50px;display:flex;align-items:flex-start;justify-content:center;gap:24px;flex-wrap:wrap">
  <!-- DEPARTMENT -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white;letter-spacing:.04em">DEPARTMENT</span>
    </div>
    <div style="background:#ede9fe;padding:10px 20px;border-left:1px solid #7c3aed;border-right:1px solid #7c3aed">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#4c1d95;font-weight:600">🔑 dept_id  INT PK</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">dept_name  VARCHAR(80)</span>
    </div>
    <div style="background:#f5f3ff;padding:10px 20px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px">
    </div>
  </div>

  <!-- Arrow -->
  <div style="display:flex;align-items:center;padding-top:60px;color:#7c3aed;font-size:28px;font-weight:700">←</div>

  <!-- MODULE -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white">MODULE</span>
    </div>
    <div style="background:#ede9fe;padding:10px 20px;border-left:1px solid #7c3aed;border-right:1px solid #7c3aed">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#4c1d95;font-weight:600">🔑 module_code  VARCHAR PK</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">module_name  VARCHAR(100)</span>
    </div>
    <div style="background:#f5f3ff;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">credits  INT</span>
    </div>
    <div style="background:#e0f2fe;padding:10px 20px;border:1px solid #bae6fd;border-top:0;border-radius:0 0 8px 8px">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#0369a1;font-weight:600">🔗 dept_id  INT FK→DEPT</span>
    </div>
  </div>

  <!-- Arrow -->
  <div style="display:flex;align-items:center;padding-top:60px;color:#7c3aed;font-size:28px;font-weight:700">↔</div>

  <!-- ENROLMENT -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#312e81;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white">ENROLMENT</span>
    </div>
    <div style="background:#dbeafe;padding:10px 20px;border-left:2px solid #2563eb;border-right:2px solid #2563eb">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1d4ed8;font-weight:700">🔑🔗 student_id  INT PK+FK→STUDENT</span>
    </div>
    <div style="background:#e0f2fe;padding:10px 20px;border:2px solid #2563eb;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1d4ed8;font-weight:700">🔑🔗 module_code  VARCHAR PK+FK→MODULE</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">grade  DECIMAL(4,2)</span>
    </div>
    <div style="background:#f0fdf4;padding:8px 20px;border-radius:6px;margin-top:8px;border:1px solid #bbf7d0">
      <span style="font-size:12px;color:#14532d">PK = (student_id, module_code)</span>
    </div>
  </div>

  <!-- Arrow -->
  <div style="display:flex;align-items:center;padding-top:60px;color:#7c3aed;font-size:28px;font-weight:700">↔</div>

  <!-- STUDENT -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white">STUDENT</span>
    </div>
    <div style="background:#ede9fe;padding:10px 20px;border-left:1px solid #7c3aed;border-right:1px solid #7c3aed">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#4c1d95;font-weight:600">🔑 student_id  INT PK</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">first_name  VARCHAR(50)</span>
    </div>
    <div style="background:#f5f3ff;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">last_name  VARCHAR(50)</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">date_of_birth  DATE</span>
    </div>
    <div style="background:#ecfdf5;padding:10px 20px;border:1px solid #d1fae5;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#065f46">street_name  VARCHAR(80)</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#065f46">city  VARCHAR(50)</span>
    </div>
    <div style="background:#ecfdf5;padding:10px 20px;border:1px solid #d1fae5;border-top:0;border-radius:0 0 8px 8px">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#065f46">post_code  VARCHAR(10)</span>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-sectionbreak",label:"18 Section — Activity",html:`<div class="sb-watermark">03</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">ACTIVITY</p>
  <h2 class="a2">Map the ER Diagram</h2>
  <p class="a3" style="font-size:22px;color:rgba(255,255,255,.38);font-weight:300;margin-top:16px">Apply all 8 rules to a fresh scenario</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-act",label:"19 Activity — Project Management",html:`<div class="act-body">
  <div class="act-left">
    <div class="act-badge a1" style="background:#fef3c7;color:#92400e">Activity</div>
    <h2 class="a2">Project Management System</h2>
    <p class="scenario-text a3">A company tracks <strong>EMPLOYEE</strong> and <strong>PROJECT</strong> entities.<br/><br/>
      Each <strong>EMPLOYEE</strong> has an EmpId (key), a <strong>Name</strong> (composite: FirstName, LastName), and a <strong>{SkillSet}</strong> (multivalued).<br/><br/>
      Each <strong>PROJECT</strong> has a ProjectId (key), ProjectName, and StartDate.<br/><br/>
      An EMPLOYEE can work on many PROJECTs and a PROJECT can have many EMPLOYEEs. The <strong>WORKS_ON</strong> relationship records <strong>HoursPerWeek</strong>.<br/><br/>
      Every EMPLOYEE must work on at least one PROJECT. A PROJECT may exist before any employee is assigned.
    </p>
    <div class="task-box a4">
      <div class="task-title">Your Task</div>
      <p>Apply the 8 mapping rules. List <strong>all tables</strong> with their columns, PKs, and FKs. Which rule creates each table?</p>
    </div>
  </div>
  <div class="act-right">
    <div style="width:100%;height:100%;border:2px dashed #d8b4fe;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#faf5ff">
      <p style="font-size:20px;color:#c4b5fd;font-weight:500">Your schema here</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-ans-light",label:"20 Activity Answer — Project Management",html:`<div class="ans-header">
  <span style="background:#dcfce7;color:#14532d;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Answer</span>
  <h2>Project Management Schema</h2>
  <span style="margin-left:auto;font-size:14px;color:#6b7280">4 tables — 2 entities + 1 multivalued + 1 junction</span>
</div>
<div style="flex:1;padding:18px 50px 46px;display:flex;align-items:flex-start;gap:28px;overflow:hidden">
  <!-- EMPLOYEE table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">EMPLOYEE</span></div>
    <div style="background:#ede9fe;padding:9px 16px;border:1px solid #c4b5fd;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#4c1d95;font-weight:700">🔑 emp_id  INT PK</span></div>
    <div style="background:white;padding:9px 16px;border:1px solid #e9d5ff;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">first_name  VARCHAR(50)</span></div>
    <div style="background:#f5f3ff;padding:9px 16px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">last_name  VARCHAR(50)</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 1 · Name flattened</div>
  </div>

  <div style="display:flex;align-items:center;padding-top:44px;font-size:20px;color:#a78bfa">→</div>

  <!-- EMPLOYEE_SKILL table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#312e81;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">EMPLOYEE_SKILL</span></div>
    <div style="background:#dbeafe;padding:9px 16px;border:2px solid #3b82f6;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑🔗 emp_id  INT PK+FK→EMP</span></div>
    <div style="background:#e0f2fe;padding:9px 16px;border:2px solid #3b82f6;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑 skill  VARCHAR(80) PK</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 3 · {SkillSet} multivalued</div>
  </div>

  <div style="display:flex;align-items:center;padding-top:44px;font-size:20px;color:#a78bfa">↔</div>

  <!-- WORKS_ON table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#312e81;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">WORKS_ON</span></div>
    <div style="background:#dbeafe;padding:9px 16px;border:2px solid #2563eb;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑🔗 emp_id  INT PK+FK→EMP</span></div>
    <div style="background:#e0f2fe;padding:9px 16px;border:2px solid #2563eb;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑🔗 project_id  INT PK+FK→PROJ</span></div>
    <div style="background:white;padding:9px 16px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">hours_per_week  DECIMAL(5,2)</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 5 · M:N + relationship attr</div>
  </div>

  <div style="display:flex;align-items:center;padding-top:44px;font-size:20px;color:#a78bfa">←</div>

  <!-- PROJECT table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">PROJECT</span></div>
    <div style="background:#ede9fe;padding:9px 16px;border:1px solid #c4b5fd;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#4c1d95;font-weight:700">🔑 project_id  INT PK</span></div>
    <div style="background:white;padding:9px 16px;border:1px solid #e9d5ff;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">project_name  VARCHAR(100)</span></div>
    <div style="background:#f5f3ff;padding:9px 16px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">start_date  DATE</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 1</div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-mistakes",label:"21 Common Mapping Mistakes",html:`<div class="mistakes-inner">
  <h2 class="a1">Common Mapping Mistakes</h2>
  <div class="mistake-grid">
    <div class="mistake-pair a2">
      <div class="mk-wrong"><div class="mk-label">❌ Storing derived attributes</div><p>Adding an "age" column that goes stale every birthday. Never store what can be computed.</p></div>
      <div class="mk-right"><div class="mk-label">✅ Compute in queries</div><p>Store date_of_birth, then compute age with DATEDIFF() when needed.</p></div>
    </div>
    <div class="mistake-pair a3">
      <div class="mk-wrong"><div class="mk-label">❌ Composite attr as one column</div><p>Creating an "address VARCHAR(200)" column for a composite Address attribute.</p></div>
      <div class="mk-right"><div class="mk-label">✅ Flatten sub-attributes</div><p>Create street_name, city, post_code as separate columns — queryable individually.</p></div>
    </div>
    <div class="mistake-pair a4">
      <div class="mk-wrong"><div class="mk-label">❌ M:N with two FKs in one table</div><p>Adding both student_id and module_code as FKs in one of the entity tables.</p></div>
      <div class="mk-right"><div class="mk-label">✅ Always create a junction table</div><p>Create ENROLMENT(student_id FK, module_code FK, grade). Junction table is mandatory for M:N.</p></div>
    </div>
    <div class="mistake-pair a5">
      <div class="mk-wrong"><div class="mk-label">❌ FK on the wrong side of 1:N</div><p>Putting the FK in the "1" side table (e.g., dept_id in DEPARTMENT instead of MODULE).</p></div>
      <div class="mk-right"><div class="mk-label">✅ FK always on the N-side</div><p>The MANY side gets the FK — MODULE.dept_id references DEPARTMENT.dept_id.</p></div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-takeaways",label:"22 Key Takeaways",html:`<div class="takeaways-inner">
  <h2 class="a1">Key Takeaways</h2>
  <div class="takeaway-list">
    <div class="takeaway-item a2"><div class="takeaway-num">1</div><p><strong>Each strong entity → one table.</strong> Key attribute → PRIMARY KEY. Simple attributes → columns.</p></div>
    <div class="takeaway-item a3"><div class="takeaway-num">2</div><p><strong>Composite attributes are flattened.</strong> Each sub-attribute becomes its own column. The composite parent is never stored.</p></div>
    <div class="takeaway-item a4"><div class="takeaway-num">3</div><p><strong>Multivalued attributes → separate table</strong> with FK + composite PK. M:N relationships → junction table with two FKs + relationship attributes.</p></div>
    <div class="takeaway-item a5"><div class="takeaway-num">4</div><p><strong>1:N → FK on the N-side.</strong> The many-side entity's table gets the FK column pointing to the one-side's PK.</p></div>
    <div class="takeaway-item a5" style="animation-delay:.75s"><div class="takeaway-num">5</div><p><strong>Derived attributes → do NOT store.</strong> Compute them at query time from stored data to avoid stale values.</p></div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`},{classes:"s-end",label:"23 End",html:`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1800" cy="200" r="380" fill="rgba(124,58,237,0.06)"/>
  <circle cx="120" cy="880" r="300" fill="rgba(167,139,250,0.04)"/>
</svg>
<div class="end-inner a1">
  <p style="font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:#6d28d9;margin-bottom:28px;font-weight:700">MBI802 · ER DIAGRAMS SERIES</p>
  <h1>End of Lesson 5</h1>
  <p>You can now translate any ER diagram into a full relational schema.</p>
  <p class="end-note">Use the flashcards below to review the 8 mapping rules.</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`}],ws=[{front:"What is ER-to-relational mapping?",back:"The process of converting an ER diagram into a set of relational database tables by applying a set of deterministic rules — one rule per ER construct."},{front:"How does a strong entity map to a relational schema?",back:"The entity becomes a table. Each simple attribute becomes a column. The key attribute becomes the PRIMARY KEY."},{front:"How does a composite attribute map?",back:"Flatten each sub-attribute into its own column. The composite parent itself is NOT a column. E.g., Address → street_name, city, post_code."},{front:"How does a multivalued attribute map?",back:"Create a new table with the attribute value as a column + FK to the original entity. The PK of the new table = (entity_pk + attribute_value)."},{front:"How does a 1:N relationship map?",back:"Add the '1' side's primary key as a FOREIGN KEY in the 'N' side's table. No new table is created."},{front:"How does a M:N relationship map?",back:"Create a junction (bridge) table containing the PKs of both entities as foreign keys, plus any relationship attributes. The junction PK is a composite of both FKs."},{front:"How does a 1:1 relationship map?",back:"Add the FK in either table — preferably the total-participation (mandatory) side. Alternatively, merge both entities into one table if they always co-exist."},{front:"How does a weak entity map?",back:"Create a table with a COMPOSITE PRIMARY KEY = (partial key + identifying entity's PK). The identifying entity's PK also serves as a foreign key."},{front:"How does a derived attribute map?",back:"Generally NOT stored as a column. Derived values are computed at query time from stored data (e.g., age from date_of_birth using DATEDIFF in SQL)."},{front:"Where does a relationship attribute (e.g., Grade) go in the schema?",back:"In the junction table for the M:N relationship — it belongs to the relationship itself, not to either entity alone."},{front:"What is a junction table?",back:"A table created to resolve a M:N relationship. It holds the PKs of both entities as foreign keys, plus any attributes of the relationship."},{front:"Which side gets the FK in a 1:N relationship?",back:"The MANY (N) side. Each 'many' row points back to its single parent via a FK column. E.g., ORDER.customer_id → CUSTOMER.customer_id."}];function ks(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),[A,N]=a.useState({}),z=a.useRef(null),M=a.useRef(null),S=Xe.length;a.useEffect(()=>{const d="erm-deck-styles";if(!document.getElementById(d)){const l=document.createElement("style");l.id=d,l.textContent=us,document.head.appendChild(l)}return()=>{const l=document.getElementById(d);l&&l.remove()}},[]),a.useEffect(()=>{const d=z.current,l=M.current;if(!d||!l)return;const c=new ResizeObserver(()=>{const{width:b,height:v}=d.getBoundingClientRect(),E=Math.min(b/1920,v/1080);l.style.transform=`scale(${E})`,l.style.transformOrigin="top left",d.style.height=`${1080*E}px`});return c.observe(d),()=>c.disconnect()},[]),a.useEffect(()=>{const d=l=>{(l.key==="ArrowRight"||l.key==="ArrowDown")&&r(c=>Math.min(c+1,S-1)),(l.key==="ArrowLeft"||l.key==="ArrowUp")&&r(c=>Math.max(c-1,0)),l.key==="Escape"&&s&&f()};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[s,S]),a.useEffect(()=>{const d=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",d),()=>document.removeEventListener("fullscreenchange",d)},[]);function D(){z.current?.requestFullscreen?.()}function f(){document.exitFullscreen?.()}const g=Xe[t];return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r(d=>Math.max(d-1,0)),disabled:t===0,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(167,139,250,0.3)"},children:e.jsx(le,{size:18})}),e.jsxs("span",{className:"text-sm font-medium text-gray-600 min-w-[80px] text-center",children:[t+1," / ",S]}),e.jsx("button",{onClick:()=>r(d=>Math.min(d+1,S-1)),disabled:t===S-1,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(167,139,250,0.3)"},children:e.jsx(X,{size:18})})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400 hidden sm:block",children:g.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>h(d=>!d),className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(167,139,250,0.3)"},title:o?"Collapse":"Expand",children:o?e.jsx(ie,{size:16}):e.jsx(ae,{size:16})}),e.jsx("button",{onClick:s?f:D,className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(167,139,250,0.3)"},title:s?"Exit fullscreen":"Fullscreen",children:s?e.jsx(oe,{size:16}):e.jsx(re,{size:16})})]})]}),e.jsx("div",{ref:z,className:"erm relative w-full overflow-hidden rounded-xl",style:{border:"1px solid rgba(167,139,250,0.3)"},children:e.jsx("div",{ref:M,style:{width:1920,height:1080},children:e.jsx("section",{className:g.classes,dangerouslySetInnerHTML:{__html:g.html}})})}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1.5",children:Xe.map((d,l)=>e.jsx("button",{onClick:()=>r(l),title:d.label,className:"rounded-full transition-all",style:{width:l===t?24:8,height:8,background:l===t?"#7c3aed":"rgba(124,58,237,0.25)"}},l))}),e.jsxs("div",{className:"mt-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("div",{style:{width:4,height:24,borderRadius:2,background:"#7c3aed",flexShrink:0}}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"Flashcards"}),e.jsx("span",{className:"text-sm text-gray-400",children:"· Click a card to flip"}),e.jsx("button",{onClick:()=>N({}),className:"ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{color:"#7c3aed",borderColor:"rgba(124,58,237,0.3)"},children:"Reset all"})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:16},children:ws.map((d,l)=>e.jsx("div",{onClick:()=>N(c=>({...c,[l]:!c[l]})),style:{cursor:"pointer",perspective:1e3,height:170},children:e.jsxs("div",{style:{position:"relative",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)",transform:A[l]?"rotateY(180deg)":"rotateY(0deg)"},children:[e.jsxs("div",{style:{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"white",borderRadius:12,padding:"18px 22px",border:"1.5px solid rgba(124,58,237,0.2)",display:"flex",flexDirection:"column",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"},children:[e.jsx("div",{style:{fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10},children:"Question"}),e.jsx("p",{style:{fontSize:14,color:"#1e293b",lineHeight:1.55,flex:1},children:d.front}),e.jsx("div",{style:{fontSize:11,color:"#a78bfa",marginTop:8,textAlign:"right"},children:"Tap to reveal ›"})]}),e.jsxs("div",{style:{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"#faf5ff",borderRadius:12,padding:"18px 22px",border:"1.5px solid rgba(124,58,237,0.35)",display:"flex",flexDirection:"column",transform:"rotateY(180deg)",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"},children:[e.jsx("div",{style:{fontSize:11,color:"#7c3aed",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10},children:"Answer"}),e.jsx("p",{style:{fontSize:14,color:"#3b0764",lineHeight:1.55,flex:1},children:d.back})]})]})},l))})]})]})}const Ss=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

.norm *{box-sizing:border-box;margin:0;padding:0}
.norm{font-family:'DM Sans',sans-serif;--title:64px;--subtitle:44px;--body:32px;--small:26px;--tiny:24px;--px:110px;--pt:96px;--pb:80px;--title-gap:48px;--item-gap:26px;--navy:#0d1b2a;--navy2:#132337;--blue:oklch(62% 0.18 250);--blue-light:oklch(94% 0.06 250);--amber:oklch(72% 0.17 55);--amber-light:oklch(96% 0.05 55);--green:oklch(62% 0.16 155);--green-light:oklch(94% 0.05 155);--red:oklch(58% 0.18 22);--red-light:oklch(95% 0.05 22);--white:#f8fafc;--off-white:#f1f5f9;--slate:#64748b;--text:#0f172a}
.norm section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:var(--text)}
.norm section.dark{background:var(--navy);color:var(--white)}
.norm section.dark2{background:var(--navy2);color:var(--white)}
.norm .slide-title{font-size:var(--title);font-weight:700;line-height:1.1;letter-spacing:-0.02em;margin-bottom:var(--title-gap);text-wrap:pretty}
.norm .slide-title .accent{color:var(--blue)}
.norm section.dark .slide-title .accent{color:var(--amber)}
.norm .slide-subtitle{font-size:var(--subtitle);font-weight:400;opacity:0.75;margin-bottom:var(--item-gap)}
.norm .body{font-size:var(--body);line-height:1.55}
.norm .small{font-size:var(--small);line-height:1.5}
.norm .tiny{font-size:var(--tiny);line-height:1.5}
.norm .badge{display:inline-block;font-size:var(--small);font-weight:600;padding:6px 22px;border-radius:999px;letter-spacing:0.04em}
.norm .badge-blue{background:var(--blue);color:#fff}
.norm .badge-amber{background:var(--amber);color:#fff}
.norm .badge-green{background:var(--green);color:#fff}
.norm .badge-red{background:var(--red);color:#fff}
.norm .section-label{font-size:var(--small);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue);margin-bottom:24px}
.norm section.dark .section-label{color:var(--amber)}
.norm table{border-collapse:collapse;font-size:var(--small);width:100%;font-family:'DM Mono',monospace}
.norm th{background:var(--navy);color:#fff;padding:14px 20px;text-align:left;font-weight:500;font-size:var(--tiny);letter-spacing:0.05em}
.norm td{padding:12px 20px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle}
.norm tr:nth-child(even) td{background:#f8fafc}
.norm tr:hover td{background:var(--blue-light)}
.norm .tbl-bad th{background:var(--red)}
.norm .tbl-good th{background:var(--green)}
.norm .tbl-neutral th{background:#334155}
.norm .cell-bad{background:oklch(92% 0.06 22)!important;color:var(--red);font-weight:600}
.norm .cell-ok{background:oklch(93% 0.05 155)!important;color:var(--green);font-weight:600}
.norm .cell-pk{background:oklch(93% 0.05 250)!important;color:var(--blue);font-weight:700}
.norm .callout{border-radius:16px;padding:28px 36px;font-size:var(--body);line-height:1.5}
.norm .callout-blue{background:var(--blue-light);border-left:6px solid var(--blue)}
.norm .callout-amber{background:var(--amber-light);border-left:6px solid var(--amber)}
.norm .callout-green{background:var(--green-light);border-left:6px solid var(--green)}
.norm .callout-red{background:var(--red-light);border-left:6px solid var(--red)}
.norm .callout strong{font-weight:700}
.norm .formula{font-family:'DM Mono',monospace;font-size:var(--subtitle);font-weight:500;color:var(--blue);background:var(--blue-light);border-radius:12px;padding:20px 36px;display:inline-block;letter-spacing:0.02em}
.norm section.dark .formula{color:var(--amber);background:rgba(255,255,255,0.08)}
.norm .dep{font-family:'DM Mono',monospace;font-size:var(--body);color:var(--blue);background:var(--blue-light);padding:10px 24px;border-radius:8px;display:inline-block;margin:6px 0}
.norm .dep-bad{color:var(--red);background:var(--red-light)}
.norm .dep-good{color:var(--green);background:var(--green-light)}
.norm ul.styled{list-style:none}
.norm ul.styled li{font-size:var(--body);line-height:1.6;padding:10px 0 10px 44px;position:relative;border-bottom:1px solid rgba(0,0,0,0.06)}
.norm ul.styled li:last-child{border-bottom:none}
.norm ul.styled li::before{content:'';position:absolute;left:0;top:18px;width:18px;height:18px;border-radius:50%;background:var(--blue)}
.norm section.dark ul.styled li::before{background:var(--amber)}
.norm section.dark ul.styled li{border-bottom:1px solid rgba(255,255,255,0.08)}
.norm .two-col{display:grid;grid-template-columns:1fr 1fr;gap:48px;flex:1;align-items:start}
.norm .two-col.wide{grid-template-columns:1.1fr 0.9fr}
.norm .activity-num{font-size:180px;font-weight:700;line-height:1;color:var(--amber);opacity:0.18;position:absolute;right:80px;top:40px;font-family:'DM Mono',monospace;pointer-events:none}
.norm .copyright{position:absolute;bottom:24px;left:0;right:0;text-align:center;font-size:24px;color:rgba(0,0,0,0.25);letter-spacing:0.04em}
.norm section.dark .copyright{color:rgba(255,255,255,0.22)}
.norm .nf-bar{display:flex;gap:0;border-radius:12px;overflow:hidden;margin-bottom:40px;height:52px;min-height:52px;flex-shrink:0;font-size:var(--small);font-weight:600;letter-spacing:0.04em}
.norm .nf-bar-item{flex:1;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);background:#334155}
.norm .nf-bar-item.active{background:var(--blue);color:#fff}
.norm .nf-bar-item.done{background:#1e3a5f;color:rgba(255,255,255,0.4)}
.norm .answer-box{border-radius:16px;background:var(--green-light);border:2.5px solid var(--green);padding:28px 36px}
.norm .answer-label{font-size:var(--small);font-weight:700;color:var(--green);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px}
.norm .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1100px}
.norm .main-title{font-size:90px;font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#fff;margin-bottom:36px}
.norm .main-title span{color:var(--amber)}
.norm .anomaly-cards{display:flex;gap:32px;flex:1;align-items:stretch}
.norm .anomaly-card{flex:1;border-radius:20px;padding:32px 32px 28px;display:flex;flex-direction:column;gap:16px}
.norm .anomaly-card .ac-title{font-size:var(--body);font-weight:700}
.norm .anomaly-card .ac-desc{font-size:var(--small);line-height:1.5;flex:1}
.norm .anomaly-card .ac-example{font-size:var(--tiny);font-family:'DM Mono',monospace;background:rgba(0,0,0,0.06);border-radius:8px;padding:10px 14px;line-height:1.5}
.norm .summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;flex:1}
.norm .summary-card{border-radius:18px;padding:32px 36px;display:flex;flex-direction:column;gap:14px;color:var(--text)}
.norm .summary-card .sc-nf{font-size:var(--subtitle);font-weight:700;font-family:'DM Mono',monospace}
.norm .summary-card .sc-rule{font-size:var(--small);font-weight:600;line-height:1.4}
.norm .summary-card .sc-ex{font-size:var(--tiny);opacity:0.75;line-height:1.4}
.norm .visual-box{padding:24px 40px;border-radius:16px;font-size:40px;font-weight:700;display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1)}
.norm .visual-arrow{font-size:60px;color:var(--slate);font-weight:300}`,et=[{classes:"dark",label:"01 Title",html:`
    <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.04;pointer-events:none" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <defs><pattern id="norm-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" stroke-width="1"/></pattern></defs>
      <rect width="1920" height="1080" fill="url(#norm-grid)"/>
    </svg>
    <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--blue);"></div>
    <div style="position:absolute;right:180px;bottom:160px;width:320px;height:320px;border-radius:50%;border:3px solid var(--amber);opacity:0.15;"></div>
    <div style="position:absolute;right:280px;bottom:220px;width:180px;height:180px;border-radius:50%;background:var(--amber);opacity:0.08;"></div>
    <div class="title-slide-inner" style="padding-left:8px;">
      <div style="margin-bottom:32px;">
        <span class="badge badge-blue">CS / Database Systems</span>
      </div>
      <div class="main-title">Database<br/><span>Normalization</span> &amp;<br/>Functional Dependencies</div>
      <div style="font-size:var(--body);color:rgba(255,255,255,0.55);max-width:760px;line-height:1.6;">
        Understanding 1NF, 2NF, 3NF, BCNF and Decomposition with real-world examples and hands-on activities.
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"02 Why Normalize",html:`
    <div class="section-label">The Problem</div>
    <div class="slide-title">What goes wrong without <span class="accent">normalization?</span></div>
    <div style="margin-bottom:32px;">
      <div style="font-size:var(--small);font-weight:600;margin-bottom:10px;color:var(--slate);">⚠ Unnormalized table: Student_Courses</div>
      <table class="tbl-bad">
        <thead><tr><th>StudentID</th><th>StudentName</th><th>Dept</th><th>DeptHead</th><th>Courses</th><th>Instructor</th></tr></thead>
        <tbody>
          <tr><td class="cell-pk">S1</td><td>Alice</td><td>CS</td><td>Dr. Smith</td><td class="cell-bad">DB, OS, Networks</td><td class="cell-bad">Prof. Lee, Prof. Ray, Prof. Kim</td></tr>
          <tr><td class="cell-pk">S2</td><td>Bob</td><td>CS</td><td>Dr. Smith</td><td class="cell-bad">DB, AI</td><td class="cell-bad">Prof. Lee, Prof. Patel</td></tr>
          <tr><td class="cell-pk">S3</td><td>Carol</td><td>Math</td><td>Dr. Jones</td><td class="cell-bad">Calculus</td><td class="cell-bad">Prof. Wang</td></tr>
          <tr><td class="cell-pk">S3</td><td>Carol</td><td>Math</td><td>Dr. Jones</td><td class="cell-bad">Statistics</td><td class="cell-bad">Prof. Hill</td></tr>
        </tbody>
      </table>
    </div>
    <div class="anomaly-cards">
      <div class="anomaly-card" style="background:var(--red-light);border:2px solid var(--red);">
        <div class="ac-title" style="color:var(--red);">🔴 Update Anomaly</div>
        <div class="ac-desc">If Dr. Smith leaves, we must update <em>every row</em> for CS students — miss one and data is inconsistent.</div>
        <div class="ac-example">DeptHead = "Dr. Smith" repeated in S1 AND S2 rows</div>
      </div>
      <div class="anomaly-card" style="background:var(--amber-light);border:2px solid var(--amber);">
        <div class="ac-title" style="color:var(--amber);">🟡 Insertion Anomaly</div>
        <div class="ac-desc">We cannot add a new department unless at least one student is enrolled in it — student data is required!</div>
        <div class="ac-example">Can't record "Physics dept, Head: Dr. Gupta" alone</div>
      </div>
      <div class="anomaly-card" style="background:var(--blue-light);border:2px solid var(--blue);">
        <div class="ac-title" style="color:var(--blue);">🔵 Deletion Anomaly</div>
        <div class="ac-desc">If Carol drops Statistics, we lose the fact that Prof. Hill teaches Statistics entirely from our database.</div>
        <div class="ac-example">Deleting S3's Statistics row erases Prof. Hill's record</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"03 Functional Dependencies",html:`
    <div class="section-label">Core Concept</div>
    <div class="slide-title">Functional <span class="accent">Dependencies</span></div>
    <div class="two-col" style="align-items:start;gap:80px;">
      <div>
        <div style="font-size:var(--body);color:rgba(255,255,255,0.75);margin-bottom:32px;line-height:1.6;">
          Attribute <strong style="color:#fff;">Y</strong> is <em>functionally dependent</em> on <strong style="color:#fff;">X</strong> if knowing X uniquely determines the value of Y.
        </div>
        <div class="formula">X → Y</div>
        <div style="margin-top:20px;font-size:var(--small);color:rgba(255,255,255,0.55);">"X determines Y" &nbsp;·&nbsp; "Y depends on X"</div>
        <div style="margin-top:44px;">
          <div style="font-size:var(--small);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);margin-bottom:20px;">Key Terminology</div>
          <ul class="styled">
            <li><strong>Determinant</strong> — the left-hand side (X)</li>
            <li><strong>Dependent</strong> — the right-hand side (Y)</li>
            <li><strong>Candidate Key</strong> — minimal set that determines all attributes</li>
            <li><strong>Prime Attribute</strong> — part of any candidate key</li>
          </ul>
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);margin-bottom:20px;">Real-world examples</div>
        <div style="display:flex;flex-direction:column;gap:18px;">
          <div style="background:rgba(255,255,255,0.07);border-radius:14px;padding:24px 28px;">
            <div class="dep" style="color:var(--amber);background:rgba(255,255,255,0.1);">StudentID → StudentName</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.6);margin-top:10px;">One student ID maps to exactly one name</div>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:14px;padding:24px 28px;">
            <div class="dep" style="color:var(--amber);background:rgba(255,255,255,0.1);">Dept → DeptHead</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.6);margin-top:10px;">Each department has exactly one head</div>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:14px;padding:24px 28px;">
            <div class="dep" style="color:var(--amber);background:rgba(255,255,255,0.1);">{OrderID, ProductID} → Quantity</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.6);margin-top:10px;">Composite key: need both to know the quantity</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"04 Visual: 1NF",html:`
    <div class="nf-bar">
      <div class="nf-bar-item active">1NF</div>
      <div class="nf-bar-item">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title" style="text-align:center;margin-top:40px;">1NF in a Nutshell:<br/><span class="accent">Break apart the lists</span></div>
    <div style="display:flex;justify-content:center;align-items:center;flex:1;gap:60px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
        <div class="visual-box" style="background:var(--red-light);border:4px solid var(--red);color:var(--red);">[ 🍎, 🍌, 🍒 ]</div>
        <div style="font-size:var(--small);color:var(--slate);font-weight:600;text-transform:uppercase;">Multi-valued (Bad)</div>
      </div>
      <div class="visual-arrow">➔</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">🍎</div>
          <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">🍌</div>
          <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">🍒</div>
        </div>
        <div style="font-size:var(--small);color:var(--slate);font-weight:600;text-transform:uppercase;">Atomic Values (Good)</div>
      </div>
    </div>
    <h2 style="text-align:center;color:var(--slate);font-size:var(--body);font-weight:500;margin-bottom:60px;">
      Rule: One single value per cell. No lists or arrays allowed!
    </h2>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"05 1NF Concept",html:`
    <div class="nf-bar">
      <div class="nf-bar-item active">1NF</div>
      <div class="nf-bar-item">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">First Normal Form <span class="accent">(1NF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:32px;">
          <strong>Definition:</strong> A table is in 1NF if every cell contains a single, atomic (indivisible) value and each column holds only one type of data.
        </div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:16px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Rules to satisfy 1NF</div>
        <ul class="styled">
          <li>No multi-valued attributes (no lists in a cell)</li>
          <li>No repeating groups of columns</li>
          <li>Each row must be uniquely identifiable (primary key exists)</li>
          <li>All values in a column must be the same data type</li>
        </ul>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:16px;letter-spacing:0.06em;text-transform:uppercase;color:var(--red);">❌ Violates 1NF</div>
        <table class="tbl-bad" style="margin-bottom:28px;">
          <thead><tr><th>OrderID</th><th>Products</th></tr></thead>
          <tbody>
            <tr><td>101</td><td class="cell-bad">Laptop, Mouse, Keyboard</td></tr>
            <tr><td>102</td><td class="cell-bad">Monitor, HDMI Cable</td></tr>
          </tbody>
        </table>
        <div style="font-size:var(--tiny);color:var(--red);margin-bottom:24px;">Multiple values in the "Products" cell — not atomic!</div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:16px;letter-spacing:0.06em;text-transform:uppercase;color:var(--green);">✅ Satisfies 1NF</div>
        <table class="tbl-good">
          <thead><tr><th>OrderID</th><th>Product</th></tr></thead>
          <tbody>
            <tr><td>101</td><td class="cell-ok">Laptop</td></tr>
            <tr><td>101</td><td class="cell-ok">Mouse</td></tr>
            <tr><td>101</td><td class="cell-ok">Keyboard</td></tr>
            <tr><td>102</td><td class="cell-ok">Monitor</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"06 1NF Example",html:`
    <div class="nf-bar">
      <div class="nf-bar-item active">1NF</div>
      <div class="nf-bar-item">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">1NF — <span class="accent">Library Book Example</span></div>
    <div class="two-col">
      <div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
          <span class="badge badge-red">Before 1NF</span>
          <span style="font-size:var(--small);color:var(--slate);">Member borrows multiple books</span>
        </div>
        <table class="tbl-bad">
          <thead><tr><th>MemberID</th><th>Name</th><th>BooksCheckedOut</th><th>ReturnDates</th></tr></thead>
          <tbody>
            <tr><td>M1</td><td>Alice</td><td class="cell-bad">Harry Potter, Dune</td><td class="cell-bad">Dec 1, Dec 5</td></tr>
            <tr><td>M2</td><td>Bob</td><td class="cell-bad">1984, Brave New World, Hobbit</td><td class="cell-bad">Dec 3, Dec 3, Dec 10</td></tr>
          </tbody>
        </table>
        <div class="callout callout-red" style="margin-top:20px;font-size:var(--small);">
          <strong>Problems:</strong> BooksCheckedOut and ReturnDates are multi-valued. You can't query "who has Dune?" easily. Dates are ambiguously paired.
        </div>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
          <span class="badge badge-green">After 1NF</span>
          <span style="font-size:var(--small);color:var(--slate);">One book per row</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>MemberID</th><th>Name</th><th>Book</th><th>ReturnDate</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">M1</td><td>Alice</td><td class="cell-ok">Harry Potter</td><td>Dec 1</td></tr>
            <tr><td class="cell-pk">M1</td><td>Alice</td><td class="cell-ok">Dune</td><td>Dec 5</td></tr>
            <tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">1984</td><td>Dec 3</td></tr>
            <tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">Brave New World</td><td>Dec 3</td></tr>
            <tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">The Hobbit</td><td>Dec 10</td></tr>
          </tbody>
        </table>
        <div class="callout callout-green" style="margin-top:20px;font-size:var(--small);">
          <strong>PK:</strong> (MemberID, Book) — composite key. Every cell is atomic. Easy to query!
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"07 Visual: 2NF",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item active">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title" style="text-align:center;margin-top:40px;">2NF in a Nutshell:<br/><span class="accent">Rely on the WHOLE key</span></div>
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1;gap:50px;">
      <div style="display:flex;align-items:center;gap:40px;">
        <div class="visual-box" style="background:var(--navy);color:white;">🔑 Student + 🔑 Course</div>
        <div class="visual-arrow">➔</div>
        <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">Course Grade ✅</div>
      </div>
      <div style="display:flex;align-items:center;gap:40px;">
        <div class="visual-box" style="background:var(--navy);color:white;opacity:0.6;">🔑 Student <span style="font-size:20px;margin-left:20px;font-weight:400;">(Only part of the key)</span></div>
        <div class="visual-arrow" style="color:var(--red);">➔</div>
        <div class="visual-box" style="background:var(--red-light);border:4px dashed var(--red);color:var(--red);">Student Phone ❌</div>
      </div>
    </div>
    <h2 style="text-align:center;color:var(--slate);font-size:var(--body);font-weight:500;margin-bottom:60px;">
      Rule: No "partial" dependencies. If your table has a two-part key, <br/>every other column must need BOTH parts to exist.
    </h2>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"08 2NF Concept",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item active">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">Second Normal Form <span class="accent">(2NF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:28px;">
          <strong>Definition:</strong> A table is in 2NF if it is in 1NF <em>and</em> every non-prime attribute is <em>fully functionally dependent</em> on the <strong>entire</strong> primary key (no partial dependencies).
        </div>
        <div class="callout callout-amber" style="margin-bottom:28px;">
          <strong>Partial Dependency:</strong> A non-key attribute depends on only <em>part</em> of a composite primary key.
        </div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Only matters when the PK is composite</div>
        <div style="font-size:var(--body);color:var(--text);line-height:1.6;">
          If the primary key is a <em>single</em> attribute, the table is automatically in 2NF (there's nothing to partially depend on).
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:18px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Spotting the violation</div>
        <div style="background:#f8fafc;border-radius:16px;padding:28px;border:2px solid #e2e8f0;">
          <div style="font-size:var(--small);font-weight:600;margin-bottom:14px;">Table: OrderItem (OrderID, ProductID, ProductName, Qty)</div>
          <div style="font-family:'DM Mono',monospace;font-size:var(--small);color:var(--blue);margin-bottom:8px;">PK = {OrderID, ProductID}</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:18px;">
            <div class="dep dep-bad">{OrderID, ProductID} → Qty &nbsp;&nbsp; ✅ FULL</div>
            <div class="dep dep-bad">ProductID → ProductName &nbsp; ❌ PARTIAL</div>
          </div>
          <div style="font-size:var(--tiny);color:var(--red);margin-top:14px;line-height:1.5;">
            ProductName only depends on ProductID, not the full composite key. This is a partial dependency!
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"09 2NF Example",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item active">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">2NF — <span class="accent">Online Store Example</span></div>
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;">
        <span class="badge badge-red">Before 2NF</span>
        <span style="font-family:'DM Mono',monospace;font-size:var(--small);color:var(--slate);">PK = {OrderID, ProductID}</span>
      </div>
      <table class="tbl-bad">
        <thead><tr><th>OrderID 🔑</th><th>ProductID 🔑</th><th>ProductName</th><th>UnitPrice</th><th>CustomerName</th><th>Qty</th></tr></thead>
        <tbody>
          <tr><td>O1</td><td>P10</td><td class="cell-bad">Laptop</td><td class="cell-bad">$999</td><td class="cell-bad">Alice</td><td>1</td></tr>
          <tr><td>O1</td><td>P20</td><td class="cell-bad">Mouse</td><td class="cell-bad">$29</td><td class="cell-bad">Alice</td><td>2</td></tr>
          <tr><td>O2</td><td>P10</td><td class="cell-bad">Laptop</td><td class="cell-bad">$999</td><td class="cell-bad">Bob</td><td>1</td></tr>
        </tbody>
      </table>
      <div style="font-size:var(--tiny);color:var(--red);margin-top:8px;">ProductName &amp; UnitPrice depend only on ProductID. CustomerName depends only on OrderID. Both are partial!</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Orders</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: OrderID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>OrderID</th><th>CustomerName</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">O1</td><td class="cell-ok">Alice</td></tr>
            <tr><td class="cell-pk">O2</td><td class="cell-ok">Bob</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Products</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: ProductID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>ProductID</th><th>ProductName</th><th>UnitPrice</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">P10</td><td class="cell-ok">Laptop</td><td>$999</td></tr>
            <tr><td class="cell-pk">P20</td><td class="cell-ok">Mouse</td><td>$29</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">OrderItems</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: {OrderID, ProductID}</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>OrderID</th><th>ProductID</th><th>Qty</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">O1</td><td class="cell-pk">P10</td><td class="cell-ok">1</td></tr>
            <tr><td class="cell-pk">O1</td><td class="cell-pk">P20</td><td class="cell-ok">2</td></tr>
            <tr><td class="cell-pk">O2</td><td class="cell-pk">P10</td><td class="cell-ok">1</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"10 Visual: 3NF",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item active">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title" style="text-align:center;margin-top:40px;">3NF in a Nutshell:<br/><span class="accent">Cut the Chain (No Middlemen)</span></div>
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1;gap:40px;">
      <div style="display:flex;align-items:center;gap:30px;">
        <div class="visual-box" style="background:var(--navy);color:white;">🧍 Employee</div>
        <div class="visual-arrow">➔</div>
        <div class="visual-box" style="background:var(--amber-light);border:4px solid var(--amber);color:var(--amber);">🏢 Department</div>
        <div class="visual-arrow" style="color:var(--red);">➔</div>
        <div class="visual-box" style="background:var(--red-light);border:4px dashed var(--red);color:var(--red);">📞 Dept Phone</div>
      </div>
      <div style="font-size:80px;margin:10px 0;">✂️</div>
      <div style="display:flex;gap:60px;">
        <div style="display:flex;align-items:center;gap:20px;padding:20px;border:3px solid var(--green);border-radius:16px;background:var(--green-light);">
          <span style="font-size:30px;font-weight:700;color:var(--green);">Table 1:</span>
          <span style="font-size:30px;">🧍 ➔ 🏢</span>
        </div>
        <div style="display:flex;align-items:center;gap:20px;padding:20px;border:3px solid var(--green);border-radius:16px;background:var(--green-light);">
          <span style="font-size:30px;font-weight:700;color:var(--green);">Table 2:</span>
          <span style="font-size:30px;">🏢 ➔ 📞</span>
        </div>
      </div>
    </div>
    <h2 style="text-align:center;color:var(--slate);font-size:var(--body);font-weight:500;margin-bottom:60px;">
      Rule: No "transitive" dependencies. If A finds B, and B finds C... <br/>take B and C and put them in their own separate table!
    </h2>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"11 3NF Concept",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item active">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">Third Normal Form <span class="accent">(3NF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:28px;">
          <strong>Definition:</strong> A table is in 3NF if it is in 2NF <em>and</em> no non-prime attribute is <em>transitively dependent</em> on the primary key.
        </div>
        <div class="callout callout-amber" style="margin-bottom:28px;">
          <strong>Transitive Dependency:</strong> A → B and B → C, therefore A → C. C depends on A <em>indirectly</em> through B. B and C are both non-prime.
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="dep">StudentID → ZipCode</div>
          <div class="dep">ZipCode → City</div>
          <div class="dep dep-bad">StudentID → City &nbsp; (transitive — via ZipCode)</div>
        </div>
        <div style="font-size:var(--small);color:var(--red);margin-top:12px;">City should NOT be in the Students table.</div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:18px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">The Intuition</div>
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div style="background:#f8fafc;border-radius:14px;padding:24px;border:2px solid #e2e8f0;">
            <div style="font-size:var(--small);font-weight:600;margin-bottom:8px;">Employee Table (violates 3NF)</div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);line-height:1.8;">
              EmpID → Dept → DeptPhone<br/>
              <span style="color:var(--red);">EmpID → DeptPhone (transitive!)</span>
            </div>
          </div>
          <div style="background:var(--green-light);border-radius:14px;padding:24px;border:2px solid var(--green);">
            <div style="font-size:var(--small);font-weight:600;margin-bottom:8px;color:var(--green);">Fix: split into two tables</div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);line-height:1.8;">
              Employees(EmpID, Name, DeptID)<br/>
              Departments(DeptID, DeptPhone)
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"12 3NF Example",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item active">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">3NF — <span class="accent">Hospital Employee Example</span></div>
    <div style="margin-bottom:22px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;">
        <span class="badge badge-red">Before 3NF</span>
        <span style="font-family:'DM Mono',monospace;font-size:var(--small);color:var(--slate);">PK: EmpID</span>
      </div>
      <table class="tbl-bad">
        <thead><tr><th>EmpID</th><th>EmpName</th><th>DeptID</th><th>DeptName</th><th>DeptLocation</th></tr></thead>
        <tbody>
          <tr><td class="cell-pk">E1</td><td>Alice</td><td>D1</td><td class="cell-bad">Cardiology</td><td class="cell-bad">Floor 3</td></tr>
          <tr><td class="cell-pk">E2</td><td>Bob</td><td>D1</td><td class="cell-bad">Cardiology</td><td class="cell-bad">Floor 3</td></tr>
          <tr><td class="cell-pk">E3</td><td>Carol</td><td>D2</td><td class="cell-bad">Neurology</td><td class="cell-bad">Floor 5</td></tr>
        </tbody>
      </table>
      <div style="font-size:var(--tiny);color:var(--red);margin-top:8px;">EmpID → DeptID → DeptName, DeptLocation. DeptName and DeptLocation are transitively dependent on EmpID!</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Employees</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: EmpID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>EmpID</th><th>EmpName</th><th>DeptID</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">E1</td><td class="cell-ok">Alice</td><td>D1</td></tr>
            <tr><td class="cell-pk">E2</td><td class="cell-ok">Bob</td><td>D1</td></tr>
            <tr><td class="cell-pk">E3</td><td class="cell-ok">Carol</td><td>D2</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Departments</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: DeptID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>DeptID</th><th>DeptName</th><th>DeptLocation</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">D1</td><td class="cell-ok">Cardiology</td><td>Floor 3</td></tr>
            <tr><td class="cell-pk">D2</td><td class="cell-ok">Neurology</td><td>Floor 5</td></tr>
          </tbody>
        </table>
        <div class="callout callout-green" style="margin-top:16px;font-size:var(--small);">
          If Cardiology moves floors, we update <strong>one row</strong> — no anomaly!
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"13 BCNF",html:`
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item done">3NF ✓</div>
      <div class="nf-bar-item active">BCNF</div>
    </div>
    <div class="slide-title">Boyce–Codd Normal Form <span class="accent">(BCNF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:24px;">
          <strong>Definition:</strong> For every non-trivial FD X → Y, X must be a <strong>superkey</strong> (a key that uniquely identifies rows). This is stricter than 3NF.
        </div>
        <div class="callout callout-amber" style="margin-bottom:24px;">
          <strong>3NF vs BCNF:</strong> 3NF allows FDs where the right side is a prime attribute. BCNF does not — the left side must always be a superkey.
        </div>
        <div style="font-size:var(--small);color:var(--text);line-height:1.6;">
          A table can be in 3NF but <em>not</em> BCNF when there are <strong>overlapping candidate keys</strong>. BCNF may not always preserve all functional dependencies — a trade-off to be aware of.
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Classic BCNF example — Course Scheduling</div>
        <table class="tbl-bad" style="margin-bottom:14px;">
          <thead><tr><th>Student</th><th>Subject</th><th>Teacher</th></tr></thead>
          <tbody>
            <tr><td>Alice</td><td>Math</td><td>Prof. Taylor</td></tr>
            <tr><td>Alice</td><td>Science</td><td>Prof. Adams</td></tr>
            <tr><td>Bob</td><td>Math</td><td>Prof. Lee</td></tr>
            <tr><td>Bob</td><td>Science</td><td>Prof. Adams</td></tr>
          </tbody>
        </table>
        <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);margin-bottom:12px;line-height:1.6;">
          FDs: {Student, Subject} → Teacher &nbsp;·&nbsp; Teacher → Subject<br/>
          <span style="color:var(--red);">Teacher is NOT a superkey! Violates BCNF.</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">TeacherSubject</div>
            <table class="tbl-good" style="font-size:var(--tiny);">
              <thead><tr><th style="padding:8px 14px;">Teacher</th><th style="padding:8px 14px;">Subject</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk" style="padding:8px 14px;">Prof. Taylor</td><td class="cell-ok" style="padding:8px 14px;">Math</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Prof. Lee</td><td class="cell-ok" style="padding:8px 14px;">Math</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Prof. Adams</td><td class="cell-ok" style="padding:8px 14px;">Science</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">StudentTeacher</div>
            <table class="tbl-good" style="font-size:var(--tiny);">
              <thead><tr><th style="padding:8px 14px;">Student</th><th style="padding:8px 14px;">Teacher</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk" style="padding:8px 14px;">Alice</td><td class="cell-ok" style="padding:8px 14px;">Prof. Taylor</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Alice</td><td class="cell-ok" style="padding:8px 14px;">Prof. Adams</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Bob</td><td class="cell-ok" style="padding:8px 14px;">Prof. Lee</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"14 Decomposition",html:`
    <div class="section-label">Key Concept</div>
    <div class="slide-title">Decomposition</div>
    <div class="two-col" style="align-items:start;gap:80px;">
      <div>
        <div style="font-size:var(--body);color:rgba(255,255,255,0.8);margin-bottom:36px;line-height:1.6;">
          Decomposition is the process of splitting one relation into two or more relations to eliminate anomalies. A good decomposition must satisfy two properties:
        </div>
        <div style="display:flex;flex-direction:column;gap:24px;">
          <div style="background:rgba(255,255,255,0.07);border-radius:18px;padding:30px 32px;border-left:5px solid var(--amber);">
            <div style="font-size:var(--body);font-weight:700;color:var(--amber);margin-bottom:12px;">1. Lossless-Join Decomposition</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.72);line-height:1.55;">
              Joining the decomposed tables back together must reproduce the <em>exact</em> original relation — no spurious (fake) tuples, no lost data.
            </div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--amber);margin-top:14px;">R = R₁ ⋈ R₂ &nbsp;(natural join)</div>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:18px;padding:30px 32px;border-left:5px solid var(--blue);">
            <div style="font-size:var(--body);font-weight:700;color:var(--blue);margin-bottom:12px;">2. Dependency-Preserving Decomposition</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.72);line-height:1.55;">
              Every functional dependency in the original relation can still be enforced in the decomposed tables without needing to join them.
            </div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--blue);margin-top:14px;">F ≡ F₁ ∪ F₂ (FDs preserved in sub-relations)</div>
          </div>
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);margin-bottom:22px;">The Trade-off</div>
        <div style="background:rgba(255,255,255,0.07);border-radius:16px;padding:30px;margin-bottom:24px;">
          <div style="font-size:var(--small);color:rgba(255,255,255,0.8);line-height:1.6;">
            BCNF always guarantees <strong style="color:var(--amber);">lossless-join</strong>, but may <strong style="color:var(--red);">lose dependency preservation</strong>.<br/><br/>
            3NF guarantees both lossless-join AND dependency preservation — which is why it's often the practical target in real systems.
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.07);border-radius:16px;padding:30px;">
          <div style="font-size:var(--small);font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:14px;">Practical guide to decomposition</div>
          <ul class="styled">
            <li>Find a violating FD: X → Y (X is not a superkey)</li>
            <li>Create new table: (X ∪ Y) with X as PK</li>
            <li>Remove Y from original table</li>
            <li>Repeat until all FDs are satisfied</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"15 Activity 1 Question",bg:"var(--amber-light)",html:`
    <div class="activity-num">1</div>
    <div class="section-label" style="color:var(--amber);">Activity 1 — Identify the Normal Form</div>
    <div class="slide-title">Which normal form is <span style="color:var(--amber);">violated?</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div style="font-size:var(--small);font-weight:600;margin-bottom:12px;color:var(--slate);">Table: University Enrollment</div>
        <table class="tbl-neutral">
          <thead><tr><th>StudentID 🔑</th><th>CourseID 🔑</th><th>StudentName</th><th>CourseName</th><th>Grade</th></tr></thead>
          <tbody>
            <tr><td>S1</td><td>C101</td><td>Alice</td><td>Databases</td><td>A</td></tr>
            <tr><td>S1</td><td>C102</td><td>Alice</td><td>Algorithms</td><td>B</td></tr>
            <tr><td>S2</td><td>C101</td><td>Bob</td><td>Databases</td><td>A</td></tr>
            <tr><td>S2</td><td>C103</td><td>Bob</td><td>Networks</td><td>C</td></tr>
          </tbody>
        </table>
        <div style="margin-top:28px;">
          <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;">Known Functional Dependencies:</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div class="dep">{StudentID, CourseID} → Grade</div>
            <div class="dep">StudentID → StudentName</div>
            <div class="dep">CourseID → CourseName</div>
          </div>
        </div>
      </div>
      <div>
        <div style="background:white;border-radius:20px;padding:36px;border:2px solid var(--amber);">
          <div style="font-size:var(--body);font-weight:700;margin-bottom:20px;">Question: What normal form is violated, and why?</div>
          <div style="font-size:var(--small);color:var(--slate);line-height:1.7;margin-bottom:24px;">
            Consider each functional dependency. Does every non-prime attribute depend on the <em>full</em> composite primary key?<br/><br/>
            Hint: Look at StudentName and CourseName.
          </div>
          <div style="font-size:var(--small);font-weight:600;color:var(--amber);">→ See next slide for the answer</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"16 Activity 1 Answer",bg:"var(--green-light)",html:`
    <div class="activity-num" style="color:var(--green);">1</div>
    <div class="section-label" style="color:var(--green);">Activity 1 — Answer</div>
    <div class="slide-title">Violates <span style="color:var(--green);">2NF</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div class="answer-box" style="margin-bottom:24px;">
          <div class="answer-label">Violation: Partial Dependencies</div>
          <div style="font-size:var(--body);line-height:1.6;">
            <strong>StudentName</strong> depends only on StudentID (partial).<br/>
            <strong>CourseName</strong> depends only on CourseID (partial).<br/>
            Both are non-prime attributes that should depend on the <em>entire</em> key.
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="dep dep-bad">StudentID → StudentName &nbsp; ❌ Partial</div>
          <div class="dep dep-bad">CourseID → CourseName &nbsp;&nbsp; ❌ Partial</div>
          <div class="dep dep-good">{StudentID, CourseID} → Grade ✅ Full</div>
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Fix: Decompose into 3 tables</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Students(StudentID PK, StudentName)</div>
            <table class="tbl-good">
              <thead><tr><th>StudentID</th><th>StudentName</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">S1</td><td class="cell-ok">Alice</td></tr>
                <tr><td class="cell-pk">S2</td><td class="cell-ok">Bob</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Courses(CourseID PK, CourseName)</div>
            <table class="tbl-good">
              <thead><tr><th>CourseID</th><th>CourseName</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">C101</td><td class="cell-ok">Databases</td></tr>
                <tr><td class="cell-pk">C102</td><td class="cell-ok">Algorithms</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Enrollment(StudentID, CourseID, Grade)</div>
            <table class="tbl-good">
              <thead><tr><th>StudentID</th><th>CourseID</th><th>Grade</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">S1</td><td class="cell-pk">C101</td><td class="cell-ok">A</td></tr>
                <tr><td class="cell-pk">S1</td><td class="cell-pk">C102</td><td class="cell-ok">B</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"17 Activity 2 Question",bg:"#fdf4ff",html:`
    <div class="activity-num" style="color:#a855f7;">2</div>
    <div class="section-label" style="color:#a855f7;">Activity 2 — Normalize to 3NF</div>
    <div class="slide-title">Find the <span style="color:#a855f7;">transitive dependency</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div style="font-size:var(--small);font-weight:600;margin-bottom:12px;color:var(--slate);">Table: Employee_Project</div>
        <table class="tbl-neutral">
          <thead><tr><th>EmpID 🔑</th><th>EmpName</th><th>ProjectID</th><th>ProjectName</th><th>ManagerID</th><th>ManagerPhone</th></tr></thead>
          <tbody>
            <tr><td>E1</td><td>Alice</td><td>P1</td><td>Apollo</td><td>M1</td><td>555-0101</td></tr>
            <tr><td>E2</td><td>Bob</td><td>P1</td><td>Apollo</td><td>M1</td><td>555-0101</td></tr>
            <tr><td>E3</td><td>Carol</td><td>P2</td><td>Beacon</td><td>M2</td><td>555-0202</td></tr>
          </tbody>
        </table>
        <div style="margin-top:24px;">
          <div style="font-size:var(--small);font-weight:700;margin-bottom:12px;">Functional Dependencies:</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div class="dep">EmpID → EmpName, ProjectID, ManagerID</div>
            <div class="dep">ProjectID → ProjectName</div>
            <div class="dep">ManagerID → ManagerPhone</div>
          </div>
        </div>
      </div>
      <div>
        <div style="background:white;border-radius:20px;padding:36px;border:2px solid #a855f7;">
          <div style="font-size:var(--body);font-weight:700;margin-bottom:16px;">Your task:</div>
          <ul class="styled" style="margin-bottom:24px;">
            <li style="font-size:var(--small);">Assume this table is already in 2NF</li>
            <li style="font-size:var(--small);">Find all transitive dependencies</li>
            <li style="font-size:var(--small);">Decompose into tables that satisfy 3NF</li>
          </ul>
          <div style="font-size:var(--small);color:#a855f7;font-weight:600;">→ See next slide for the answer</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"18 Activity 2 Answer",bg:"#fdf4ff",html:`
    <div class="activity-num" style="color:#a855f7;">2</div>
    <div class="section-label" style="color:#a855f7;">Activity 2 — Answer</div>
    <div class="slide-title">Decomposed into <span style="color:#a855f7;">3NF</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div class="answer-box" style="margin-bottom:24px;border-color:#a855f7;background:#f5f3ff;">
          <div class="answer-label" style="color:#a855f7;">Transitive Dependencies Found</div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
            <div class="dep dep-bad">EmpID → ProjectID → ProjectName</div>
            <div class="dep dep-bad">EmpID → ManagerID → ManagerPhone</div>
          </div>
          <div style="font-size:var(--small);color:var(--slate);margin-top:12px;line-height:1.5;">
            ProjectName and ManagerPhone are not directly determined by EmpID — they travel through intermediate attributes.
          </div>
        </div>
        <div class="callout callout-blue" style="font-size:var(--small);">
          <strong>Fix:</strong> Extract each transitive dependency into its own table. Keep only direct dependencies in the original.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Employees(EmpID PK, EmpName, ProjectID FK, ManagerID FK)</div>
          <table class="tbl-good">
            <thead><tr><th>EmpID</th><th>EmpName</th><th>ProjectID</th><th>ManagerID</th></tr></thead>
            <tbody>
              <tr><td class="cell-pk">E1</td><td>Alice</td><td>P1</td><td>M1</td></tr>
              <tr><td class="cell-pk">E2</td><td>Bob</td><td>P1</td><td>M1</td></tr>
            </tbody>
          </table>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Projects(ProjectID PK, ProjectName)</div>
            <table class="tbl-good">
              <thead><tr><th>ProjectID</th><th>ProjectName</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">P1</td><td class="cell-ok">Apollo</td></tr>
                <tr><td class="cell-pk">P2</td><td class="cell-ok">Beacon</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Managers(ManagerID PK, ManagerPhone)</div>
            <table class="tbl-good">
              <thead><tr><th>ManagerID</th><th>ManagerPhone</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">M1</td><td class="cell-ok">555-0101</td></tr>
                <tr><td class="cell-pk">M2</td><td class="cell-ok">555-0202</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"19 Activity 3",bg:"#fff7ed",html:`
    <div class="activity-num" style="color:var(--amber);">3</div>
    <div class="section-label" style="color:var(--amber);">Activity 3 — BCNF Challenge</div>
    <div class="slide-title">Is this table in <span style="color:var(--amber);">BCNF?</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div style="font-size:var(--small);font-weight:600;margin-bottom:12px;color:var(--slate);">Table: Advising (Student, Advisor, Department)</div>
        <table class="tbl-neutral" style="margin-bottom:20px;">
          <thead><tr><th>Student</th><th>Advisor</th><th>Department</th></tr></thead>
          <tbody>
            <tr><td>Alice</td><td>Dr. Smith</td><td>CS</td></tr>
            <tr><td>Alice</td><td>Dr. Jones</td><td>Math</td></tr>
            <tr><td>Bob</td><td>Dr. Smith</td><td>CS</td></tr>
            <tr><td>Carol</td><td>Dr. Jones</td><td>Math</td></tr>
          </tbody>
        </table>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:12px;">Functional Dependencies:</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div class="dep">{Student, Department} → Advisor</div>
          <div class="dep">Advisor → Department</div>
        </div>
        <div style="font-size:var(--small);color:var(--slate);margin-top:14px;line-height:1.5;">
          Candidate keys: {Student, Department} and {Student, Advisor}
        </div>
      </div>
      <div>
        <div style="background:white;border-radius:20px;padding:36px;border:2px solid var(--amber);">
          <div style="font-size:var(--body);font-weight:700;margin-bottom:16px;">Questions to answer:</div>
          <ul class="styled" style="margin-bottom:28px;">
            <li style="font-size:var(--small);">Is this table in 3NF? Why?</li>
            <li style="font-size:var(--small);">Is this table in BCNF? Why?</li>
            <li style="font-size:var(--small);">If not in BCNF, decompose it</li>
            <li style="font-size:var(--small);">Is decomposition lossless? Dependency-preserving?</li>
          </ul>
          <div style="font-size:var(--tiny);font-weight:700;color:var(--amber);padding-top:14px;border-top:1.5px solid var(--amber-light);">Answer</div>
          <div style="font-size:var(--tiny);color:var(--text);margin-top:10px;line-height:1.6;">
            <strong>3NF?</strong> Yes — Advisor is a prime attribute.<br/>
            <strong>BCNF?</strong> No — Advisor → Dept, but Advisor is not a superkey.<br/>
            <strong>Decompose:</strong> R1(Advisor, Dept) · R2(Student, Advisor).<br/>
            <strong>Lossless?</strong> Yes — Advisor is PK of R1.<br/>
            <strong>Dep-preserving?</strong> No — {Student, Dept}→Advisor is lost.
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"20 Summary",html:`
    <div class="section-label">Summary</div>
    <div class="slide-title">Normal Forms — <span class="accent">Quick Reference</span></div>
    <div class="summary-grid">
      <div class="summary-card" style="background:var(--red-light);border:2px solid var(--red);">
        <div class="sc-nf" style="color:var(--red);">1NF</div>
        <div class="sc-rule">Every cell is atomic. No repeating groups. A primary key exists.</div>
        <div class="sc-ex">Fix: one value per cell, separate rows for multiple values.</div>
      </div>
      <div class="summary-card" style="background:var(--amber-light);border:2px solid var(--amber);">
        <div class="sc-nf" style="color:var(--amber);">2NF</div>
        <div class="sc-rule">In 1NF + no partial dependencies on a composite PK.</div>
        <div class="sc-ex">Fix: split attributes that depend on only part of the key into a new table.</div>
      </div>
      <div class="summary-card" style="background:var(--blue-light);border:2px solid var(--blue);">
        <div class="sc-nf" style="color:var(--blue);">3NF</div>
        <div class="sc-rule">In 2NF + no transitive dependencies (A→B→C where B is non-prime).</div>
        <div class="sc-ex">Fix: extract the transitive chain into its own table. Guarantees lossless + dependency preserving.</div>
      </div>
      <div class="summary-card" style="background:var(--green-light);border:2px solid var(--green);">
        <div class="sc-nf" style="color:var(--green);">BCNF</div>
        <div class="sc-rule">In 3NF + every determinant of any FD is a superkey.</div>
        <div class="sc-ex">Fix: decompose so left-hand side of every non-trivial FD is a superkey. May sacrifice dependency preservation.</div>
      </div>
    </div>
    <div style="margin-top:32px;display:flex;align-items:center;justify-content:space-between;">
      <div class="formula" style="font-size:var(--small);padding:14px 28px;">Unnormalized → 1NF → 2NF → 3NF → BCNF</div>
      <div style="text-align:right;">
        <div style="font-size:var(--small);color:rgba(255,255,255,0.5);line-height:1.8;">
          Database Normalization &amp; Functional Dependencies<br/>
          <strong style="color:rgba(255,255,255,0.85);">© All rights reserved · Yasas Sri Wickramasinghe</strong>
        </div>
      </div>
    </div>`}];function zs(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),A=a.useRef(null),N=a.useRef(null),z=et.length;a.useEffect(()=>{const f="norm-deck-styles";if(!document.getElementById(f)){const g=document.createElement("style");g.id=f,g.textContent=Ss,document.head.appendChild(g)}return()=>{const g=document.getElementById(f);g&&g.remove()}},[]),a.useEffect(()=>{const f=A.current,g=N.current;if(!f||!g)return;const d=new ResizeObserver(()=>{const{width:l}=f.getBoundingClientRect(),c=l/1920;g.style.transform=`scale(${c})`,g.style.transformOrigin="top left",f.style.height=`${1080*c}px`});return d.observe(f),()=>d.disconnect()},[]),a.useEffect(()=>{const f=g=>{(g.key==="ArrowRight"||g.key==="ArrowDown")&&r(d=>Math.min(d+1,z-1)),(g.key==="ArrowLeft"||g.key==="ArrowUp")&&r(d=>Math.max(d-1,0)),g.key==="Escape"&&s&&S()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[s,z]),a.useEffect(()=>{const f=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",f),()=>document.removeEventListener("fullscreenchange",f)},[]);function M(){A.current?.requestFullscreen?.()}function S(){document.exitFullscreen?.()}const D=et[t];return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r(f=>Math.max(f-1,0)),disabled:t===0,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(99,102,241,0.3)"},children:e.jsx(le,{size:18})}),e.jsxs("span",{className:"text-sm font-medium text-gray-600 min-w-[80px] text-center",children:[t+1," / ",z]}),e.jsx("button",{onClick:()=>r(f=>Math.min(f+1,z-1)),disabled:t===z-1,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(99,102,241,0.3)"},children:e.jsx(X,{size:18})})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400 hidden sm:block",children:D.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>h(f=>!f),className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(99,102,241,0.3)"},title:o?"Collapse":"Expand",children:o?e.jsx(ie,{size:16}):e.jsx(ae,{size:16})}),e.jsx("button",{onClick:s?S:M,className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(99,102,241,0.3)"},title:s?"Exit fullscreen":"Fullscreen",children:s?e.jsx(oe,{size:16}):e.jsx(re,{size:16})})]})]}),e.jsx("div",{ref:A,className:"norm relative w-full overflow-hidden rounded-xl",style:{border:"1px solid rgba(99,102,241,0.3)"},children:e.jsx("div",{ref:N,style:{width:1920,height:1080},children:e.jsx("section",{className:D.classes,style:D.bg?{background:D.bg}:void 0,dangerouslySetInnerHTML:{__html:D.html}})})}),e.jsx("div",{className:`flex flex-wrap justify-center gap-1.5 ${o?"mt-2":""}`,children:et.map((f,g)=>e.jsx("button",{onClick:()=>r(g),title:f.label,className:"rounded-full transition-all",style:{width:g===t?24:8,height:8,background:g===t?"#6366f1":"rgba(99,102,241,0.25)"}},g))})]})}const J="#0ea5e9",Tt="sisp_lab_v1_progress",It="sisp_lab_v1_groq_key",Pt={Weak:{color:"#ef4444",bg:"rgba(239,68,68,0.10)",label:"Weak",range:"0–40"},Developing:{color:"#f97316",bg:"rgba(249,115,22,0.10)",label:"Developing",range:"41–60"},Competent:{color:"#eab308",bg:"rgba(234,179,8,0.10)",label:"Competent",range:"61–75"},Proficient:{color:"#3b82f6",bg:"rgba(59,130,246,0.10)",label:"Proficient",range:"76–88"},Expert:{color:"#10b981",bg:"rgba(16,185,129,0.10)",label:"Expert",range:"89–100"}},Ns={specificity:{label:"Specificity",desc:"Precise, targeted requests tied to the specific scenario"},conceptCoverage:{label:"Concept Coverage",desc:"Explicit invocation and correct application of SISP frameworks"},outputClarity:{label:"Output Clarity",desc:"Clearly specified expected output format, structure, and depth"},contextRichness:{label:"Context Richness",desc:"Organisational details from the scenario woven into the request"},actionability:{label:"Actionability",desc:"Output would be directly usable for real SISP work"}},je=[{id:"iceberg",number:1,title:"Surfacing Hidden Causes",concept:"Iceberg Model",conceptIcon:e.jsx(Es,{size:14}),accentColor:"#0284c7",context:`TechCore Solutions, a mid-sized financial services firm, has experienced three consecutive IS project failures in 18 months. Each project ran 40–60% over budget and delivered systems that staff resisted using. The CTO's post-mortem reports focus on "poor vendor performance" and "inadequate testing." Staff surveys reveal frustration with lack of consultation, unclear ownership, and processes that "don't match how we actually work." Senior management insists the fix is a stricter procurement process.`,task:"You are advising TechCore's SISP team. Craft a prompt that uses the Iceberg Model to guide an AI in identifying the true systemic causes of TechCore's IS failures — going beyond visible symptoms to expose the organisational, cultural, and process-level factors driving these outcomes.",rubric:["Explicitly invokes the Iceberg Model or its levels (events, patterns, structures, mental models)","Distinguishes observable symptoms from structural or cultural root causes","References specific details from the TechCore scenario (failed projects, staff resistance, management framing)","Requests actionable analysis structured by model level, not just a list","Asks for output that can feed directly into SISP diagnosis or planning"],weakPromptExample:'"Why do IS projects fail at TechCore? List the causes."',guidance:"Each iceberg level should surface something different. Ask the AI to work through levels systematically, grounding its analysis in the specific evidence provided — not generic project failure theory."},{id:"six-dimensions",number:2,title:"Process Analysis Across Dimensions",concept:"Six Process Dimensions",conceptIcon:e.jsx(Be,{size:14}),accentColor:"#7c3aed",context:"Pacific National Bank (PNB) is planning to replace its 20-year-old core banking system. The SISP team must first analyse the current mortgage approval process, which takes 14 days on average and involves 8 departments. Loan officers report duplicated data entry, inconsistent credit risk assessments, and unclear handoff points. Customer satisfaction for mortgage approvals is PNB's lowest-rated product. The replacement system must address these issues without disrupting live operations.",task:"Craft a prompt that directs an AI to apply the Six Process Dimensions framework to produce a rigorous analysis of PNB's mortgage approval process — one that will form the basis of IS requirements for the new system.",rubric:["Names or clearly implies all six process dimensions (inputs, outputs, guides, enablers, resources, flow/sequence)","Anchors the analysis in PNB's specific process details (14 days, 8 departments, duplicated entry)","Requests findings per dimension, not generic commentary on the process","Asks for IS implications or system requirements derived from each dimension","Output format is appropriate for use as a planning artefact (table, structured report, etc.)"],weakPromptExample:`"Analyse the bank's loan process using the six dimensions framework."`,guidance:"The Six Process Dimensions give you a structured analytical lens. Ask the AI to examine each dimension against specific evidence from the case, then derive IS requirements from the gaps it finds."},{id:"participation",number:3,title:"Designing Stakeholder Engagement",concept:"Participation in SISP",conceptIcon:e.jsx(_e,{size:14}),accentColor:"#059669",context:'HealthFirst NZ, a government-funded regional health authority, is launching a 3-year SISP initiative to unify 12 disparate clinical information systems across 6 hospitals and 40+ community clinics. Stakeholders include clinicians (doctors, nurses, allied health), IS/IT staff, administrators, patients, and two commercial vendors with existing contracts. Previous IS planning attempts failed due to low clinician buy-in. The Minister of Health has publicly committed to a "clinician-led digital transformation."',task:"Craft a prompt that uses SISP participation principles to guide an AI in designing a stakeholder engagement strategy for HealthFirst NZ's planning process — one that addresses the political realities, clinician resistance history, and diverse stakeholder needs.",rubric:["Explicitly invokes SISP participation principles (breadth, depth, legitimacy, representativeness)","Acknowledges HealthFirst's specific political context and history of failed engagement","Asks for differentiated engagement approaches per stakeholder group","Requests mechanisms for surfacing and reconciling conflicting interests","Output is framed as a usable engagement plan, not abstract participation theory"],weakPromptExample:'"How should we involve stakeholders in the HealthFirst IS planning process?"',guidance:'Participation in SISP is not just "consulting people." Think about power dynamics, legitimacy, the difference between informing and co-designing, and how engagement must vary by planning phase and stakeholder type.'},{id:"consistency",number:4,title:"Evaluating Strategic Alignment",concept:"Consistency in SISP",conceptIcon:e.jsx(Yt,{size:14}),accentColor:"#d97706",context:`RetailMax Group's board approved a 5-year strategy centred on hyper-personalisation, seamless omnichannel customer experience, and data-driven decision making. The IS Department responded with a $12M proposal to upgrade server infrastructure, consolidate data centres, and migrate to a private cloud. The IS Director argues these are "foundational investments" that must precede any customer-facing initiatives. The Strategy Director argues the IS plan is "completely disconnected" from board priorities. The board must decide next month.`,task:"Craft a prompt that applies SISP consistency principles to produce a rigorous alignment analysis of the IS Department's proposal against the board's strategic intent — including specific gaps, risks, and a recommended path forward.",rubric:["Explicitly applies SISP consistency or alignment concepts (vertical, horizontal, or functional alignment)","References both the board strategy themes and the IS proposal specifics","Asks for a gap analysis, not just a summary of each plan","Requests risk assessment for proceeding with misaligned investments","Includes a recommendation element — what should the board decide, and on what basis?"],weakPromptExample:'"Is the RetailMax IS plan aligned with their business strategy? Explain."',guidance:"Consistency in SISP means every IS decision can be traced to strategic intent. Ask the AI to test each major IS proposal element against the strategic themes — and be explicit about what alignment means in this context."},{id:"methodology",number:5,title:"Designing a SISP Methodology",concept:"SISP Methodology & Process",conceptIcon:e.jsx(qt,{size:14}),accentColor:"#dc2626",context:'Harbour University (15,000 students, 3 campuses) is undertaking its first formal SISP exercise after a decade of ad-hoc IS decisions. The new CIO has a mandate to "get everyone on the same page about IS direction." Key challenges: no shared IS governance structure, academic staff distrust of centralised IT decisions, 40+ legacy systems with no documentation, and a culture that values autonomy over standardisation. The board wants a 3-year IS strategy delivered in 6 months.',task:"Craft a prompt that guides an AI to design a comprehensive, realistic SISP methodology for Harbour University — one appropriately tailored to the university's maturity level, culture, constraints, and stakeholder landscape.",rubric:["Specifies the SISP methodology components needed (phases, tools, deliverables, governance)","Grounds the methodology design in Harbour University's specific constraints and culture","Requests sequencing rationale — why this order, why these tools in this context","Asks for risk mitigation for each major methodology risk specific to Harbour","Output is structured as a deployable planning document, not generic SISP theory"],weakPromptExample:'"Design an IS planning process for a university."',guidance:"A good SISP methodology is not generic — it is calibrated to organisational maturity, culture, and constraints. Force the AI to justify every methodology choice against Harbour University's specific situation."}];function Es({size:t}){return e.jsxs("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),e.jsx("polyline",{points:"2 17 12 22 22 17"}),e.jsx("polyline",{points:"2 12 12 17 22 12"})]})}function Ds(){try{const t=localStorage.getItem(Tt);return t?JSON.parse(t):{}}catch{return{}}}function As(t){try{localStorage.setItem(Tt,JSON.stringify(t))}catch{}}function tt(){try{return localStorage.getItem(It)??""}catch{return""}}function js(t){try{localStorage.setItem(It,t)}catch{}}const Ms=`You are an expert evaluator for Strategic Information Systems Planning (SISP) prompt quality at postgraduate level (MBI800 Business Information Systems).

Evaluate strictly and academically. A score above 80 requires genuine sophistication. Do not be lenient.

Scoring dimensions (each 0–20):
- specificity: Precise, targeted requests tied to the specific scenario. Penalise vague or generic questions.
- conceptCoverage: Explicit, correct invocation of SISP frameworks and concepts named in the challenge.
- outputClarity: Clear specification of expected output format, structure, and depth.
- contextRichness: Specific organisational details from the scenario woven meaningfully into the request.
- actionability: Output would be directly usable for real SISP work, not merely academically interesting.

Performance levels: Weak (0–40), Developing (41–60), Competent (61–75), Proficient (76–88), Expert (89–100).

Return ONLY a valid JSON object — no markdown fences, no text outside the JSON.`;async function Cs(t,r,o){const h=`CHALLENGE: ${r.title}
SISP CONCEPT: ${r.concept}

ORGANISATIONAL CONTEXT:
${r.context}

STUDENT TASK:
${r.task}

RUBRIC CRITERIA:
${r.rubric.map((z,M)=>`${M+1}. ${z}`).join(`
`)}

STUDENT PROMPT TO EVALUATE:
"""
${o}
"""

Return a JSON object with exactly these fields:
{
  "scores": { "specificity": <0-20>, "conceptCoverage": <0-20>, "outputClarity": <0-20>, "contextRichness": <0-20>, "actionability": <0-20> },
  "totalScore": <0-100>,
  "feedback": { "specificity": "<1-2 sentences>", "conceptCoverage": "<1-2 sentences>", "outputClarity": "<1-2 sentences>", "contextRichness": "<1-2 sentences>", "actionability": "<1-2 sentences>" },
  "keyInsight": "<single most important learning point for this student>",
  "improvedPrompt": "<a substantially improved version of the student prompt>",
  "performanceLevel": "<Weak|Developing|Competent|Proficient|Expert>",
  "overallFeedback": "<2-3 sentences: encouraging but honest professional assessment>"
}`,s=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:Ms},{role:"user",content:h}],temperature:.2,max_tokens:1400,response_format:{type:"json_object"}})});if(!s.ok){const M=(await s.json().catch(()=>({})))?.error?.message??`API error ${s.status}`;throw new Error(s.status===429?"Rate limit reached. Wait a moment and try again — Groq's free tier allows 30 requests per minute.":s.status===401?"Invalid API key. Make sure you copied the full key from console.groq.com.":M)}const N=((await s.json()).choices?.[0]?.message?.content??"").match(/\{[\s\S]*\}/);if(!N)throw new Error("Could not parse evaluation response. Please try again.");return JSON.parse(N[0])}function Rs({score:t,level:r}){const h=2*Math.PI*44,s=h*(1-t/100),{color:w}=Pt[r];return e.jsx("div",{className:"flex flex-col items-center gap-1",children:e.jsxs("svg",{width:108,height:108,viewBox:"0 0 108 108",children:[e.jsx("circle",{cx:54,cy:54,r:44,fill:"none",stroke:"rgba(0,0,0,0.06)",strokeWidth:8}),e.jsx("circle",{cx:54,cy:54,r:44,fill:"none",stroke:w,strokeWidth:8,strokeDasharray:h,strokeDashoffset:s,strokeLinecap:"round",transform:"rotate(-90 54 54)",style:{transition:"stroke-dashoffset 0.8s ease"}}),e.jsx("text",{x:54,y:50,textAnchor:"middle",fontSize:22,fontWeight:700,fill:w,fontFamily:"Inter,sans-serif",children:t}),e.jsx("text",{x:54,y:66,textAnchor:"middle",fontSize:11,fill:"#6b7280",fontFamily:"Inter,sans-serif",children:"/ 100"})]})})}function Ts({dim:t,score:r,feedback:o,accentColor:h}){const{label:s,desc:w}=Ns[t],A=r/20*100,N=r>=16?"#10b981":r>=12?"#3b82f6":r>=8?"#eab308":"#f97316";return e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold",style:{color:"#1e1b4b"},children:s}),e.jsxs("span",{className:"text-xs font-bold",style:{color:N},children:[r,"/20"]})]}),e.jsx("div",{className:"w-full h-1.5 rounded-full",style:{background:"rgba(0,0,0,0.06)"},children:e.jsx("div",{className:"h-1.5 rounded-full",style:{width:`${A}%`,background:N,transition:"width 0.6s ease"}})}),e.jsx("p",{className:"text-xs leading-4",style:{color:"#6b7280"},children:w}),e.jsx("p",{className:"text-xs leading-5 mt-0.5 pl-2 border-l-2",style:{color:"#374151",borderColor:h+"60"},children:o})]})}function Is({result:t,challenge:r,showImproved:o,onToggleImproved:h,copied:s,onCopy:w,onRetry:A}){const N=Pt[t.performanceLevel],z=Object.keys(t.scores);return e.jsxs("div",{className:"mt-5 space-y-4 animate-fadeIn",children:[e.jsxs("div",{className:"rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5",style:{background:`${N.color}08`,border:`1.5px solid ${N.color}30`},children:[e.jsx(Rs,{score:t.totalScore,level:t.performanceLevel}),e.jsxs("div",{className:"flex-1 text-center sm:text-left",children:[e.jsxs("div",{className:"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2",style:{background:N.bg,color:N.color},children:[e.jsx(Ie,{size:12})," ",N.label," · ",N.range]}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:t.overallFeedback})]})]}),e.jsxs("div",{className:"rounded-2xl p-5 space-y-4",style:{background:"rgba(255,255,255,0.85)",border:"1.5px solid rgba(139,92,246,0.10)"},children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider",style:{color:"#9ca3af"},children:"Dimension Breakdown"}),z.map(M=>e.jsx(Ts,{dim:M,score:t.scores[M],feedback:t.feedback[M],accentColor:r.accentColor},M))]}),e.jsxs("div",{className:"rounded-2xl px-5 py-4 flex gap-3",style:{background:`${J}08`,border:`1.5px solid ${J}25`},children:[e.jsx(At,{size:18,style:{color:J,flexShrink:0,marginTop:1}}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider mb-1",style:{color:J},children:"Key Learning Insight"}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#1e1b4b"},children:t.keyInsight})]})]}),e.jsxs("div",{className:"rounded-2xl overflow-hidden",style:{border:"1.5px solid rgba(139,92,246,0.12)"},children:[e.jsxs("button",{onClick:h,className:"w-full flex items-center justify-between px-5 py-3 transition-all",style:{background:o?"rgba(124,58,237,0.05)":"rgba(255,255,255,0.8)"},children:[e.jsxs("span",{className:"text-xs font-bold uppercase tracking-wider",style:{color:"#7c3aed"},children:[e.jsx(Oe,{size:12,className:"inline mr-1"}),"View Improved Prompt"]}),e.jsx(Y,{size:16,style:{color:"#7c3aed",transform:o?"rotate(180deg)":"none",transition:"transform 0.2s"}})]}),o&&e.jsxs("div",{className:"px-5 pb-5 pt-3 animate-fadeIn",style:{borderTop:"1.5px solid rgba(124,58,237,0.08)"},children:[e.jsx("pre",{className:"text-sm leading-6 whitespace-pre-wrap font-sans rounded-xl p-4",style:{background:"rgba(245,243,255,0.7)",color:"#1e1b4b",border:"1px solid rgba(124,58,237,0.10)"},children:t.improvedPrompt}),e.jsxs("button",{onClick:w,className:"mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",style:{background:s?"rgba(16,185,129,0.12)":"rgba(124,58,237,0.10)",color:s?"#10b981":"#7c3aed"},children:[s?e.jsx(lt,{size:13}):e.jsx(_t,{size:13}),s?"Copied!":"Copy prompt"]})]})]}),e.jsxs("button",{onClick:A,className:"inline-flex items-center gap-2 text-xs font-semibold",style:{color:"#6b7280"},children:[e.jsx(Pe,{size:13})," Revise and resubmit"]})]})}function Ps({challenge:t,isOpen:r,onToggle:o,progress:h,state:s,onPromptChange:w,onEvaluate:A,onToggleImproved:N,onCopy:z,onRetry:M}){const S=t.accentColor,D=h?.completed??!1,f=h?.bestScore??0,g=80,d=s.prompt.trim().length>=g&&!s.isEvaluating;return e.jsxs("div",{className:"rounded-2xl overflow-hidden transition-all",style:{border:r?`1.5px solid ${S}40`:"1.5px solid rgba(139,92,246,0.10)",background:r?"rgba(255,255,255,1)":"rgba(255,255,255,0.75)",boxShadow:r?`0 4px 24px ${S}18`:"0 1px 4px rgba(0,0,0,0.04)"},children:[e.jsxs("button",{onClick:o,className:"w-full text-left flex items-center gap-4 px-5 py-4 transition-all",style:{background:r?`${S}08`:"transparent"},children:[e.jsx("div",{className:"flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",style:{background:`${S}15`,color:S},children:e.jsx("span",{className:"text-sm font-bold",children:t.number})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("span",{className:"text-xs font-bold uppercase tracking-wider",style:{color:S,opacity:.75},children:["Challenge ",t.number]}),e.jsxs("span",{className:"inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold",style:{background:`${S}15`,color:S},children:[t.conceptIcon," ",t.concept]}),D&&e.jsxs("span",{className:"inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold",style:{background:"rgba(16,185,129,0.12)",color:"#10b981"},children:[e.jsx(pt,{size:11})," ",f,"/100"]})]}),e.jsx("p",{className:"text-sm font-semibold mt-0.5",style:{color:"#1e1b4b"},children:t.title})]}),e.jsx(Y,{size:18,style:{color:S,flexShrink:0,transform:r?"rotate(180deg)":"none",transition:"transform 0.2s"}})]}),r&&e.jsxs("div",{className:"px-5 pb-6 pt-2 animate-fadeIn",style:{borderTop:`1.5px solid ${S}20`},children:[e.jsxs("div",{className:"rounded-xl p-4 mb-4",style:{background:`${S}08`,border:`1px solid ${S}20`},children:[e.jsxs("p",{className:"text-xs font-bold uppercase tracking-wider mb-2",style:{color:S},children:[e.jsx(V,{size:11,className:"inline mr-1"})," Organisational Context"]}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:t.context})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider mb-1.5",style:{color:"#6b7280"},children:"Your Task"}),e.jsx("p",{className:"text-sm leading-6 font-medium",style:{color:"#1e1b4b"},children:t.task})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider mb-2",style:{color:"#6b7280"},children:"What Makes a Strong Prompt"}),e.jsx("div",{className:"space-y-1.5",children:t.rubric.map((l,c)=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(X,{size:13,style:{color:S,flexShrink:0,marginTop:3}}),e.jsx("p",{className:"text-xs leading-5",style:{color:"#374151"},children:l})]},c))})]}),e.jsxs("div",{className:"rounded-xl px-4 py-3 mb-4",style:{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.18)"},children:[e.jsxs("p",{className:"text-xs font-bold uppercase tracking-wider mb-1",style:{color:"#ef4444"},children:[e.jsx(mt,{size:11,className:"inline mr-1"})," Example of a Weak Prompt"]}),e.jsx("p",{className:"text-sm italic",style:{color:"#7f1d1d"},children:t.weakPromptExample})]}),e.jsxs("div",{className:"rounded-xl px-4 py-3 mb-5",style:{background:`${J}07`,border:`1px solid ${J}20`},children:[e.jsxs("p",{className:"text-xs font-bold uppercase tracking-wider mb-1",style:{color:J},children:[e.jsx(At,{size:11,className:"inline mr-1"})," Guidance"]}),e.jsx("p",{className:"text-xs leading-5",style:{color:"#1e40af"},children:t.guidance})]}),(!s.result||s.isEvaluating)&&e.jsxs(e.Fragment,{children:[e.jsx("label",{className:"block text-xs font-bold uppercase tracking-wider mb-2",style:{color:"#374151"},children:"Write Your Prompt"}),e.jsx("textarea",{value:s.prompt,onChange:l=>w(l.target.value),disabled:s.isEvaluating,rows:6,placeholder:"Craft a prompt that applies SISP concepts to this scenario. Be specific about the framework, the context, and the output you need…",className:"w-full rounded-xl px-4 py-3 text-sm leading-6 resize-y outline-none transition-all",style:{border:`1.5px solid ${s.prompt.trim().length>=g?S+"60":"rgba(139,92,246,0.15)"}`,background:"rgba(255,255,255,0.9)",color:"#1e1b4b",minHeight:120}}),e.jsxs("div",{className:"flex items-center justify-between mt-1 mb-4",children:[e.jsx("span",{className:"text-xs",style:{color:s.prompt.trim().length>=g?"#10b981":"#9ca3af"},children:s.prompt.trim().length<g?`${g-s.prompt.trim().length} more characters to unlock evaluation`:"Ready to evaluate"}),e.jsxs("span",{className:"text-xs",style:{color:"#9ca3af"},children:[s.prompt.trim().length," chars"]})]}),s.error&&e.jsxs("div",{className:"rounded-xl px-4 py-3 mb-4 flex gap-2",style:{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"},children:[e.jsx(mt,{size:15,style:{color:"#ef4444",flexShrink:0,marginTop:1}}),e.jsx("p",{className:"text-xs leading-5",style:{color:"#991b1b"},children:s.error})]}),e.jsx("button",{onClick:A,disabled:!d,className:"btn-primary w-full sm:w-auto justify-center",children:s.isEvaluating?e.jsxs(e.Fragment,{children:[e.jsx(Ce,{size:15,className:"animate-spin"})," Evaluating…"]}):e.jsxs(e.Fragment,{children:[e.jsx(Oe,{size:15})," Evaluate My Prompt"]})})]}),s.result&&!s.isEvaluating&&e.jsx(Is,{result:s.result,challenge:t,showImproved:s.showImproved,onToggleImproved:N,copied:s.copied,onCopy:z,onRetry:M})]})]})}function Ls(){return{prompt:"",isEvaluating:!1,result:null,showImproved:!1,copied:!1,error:null}}function Bs(){const[t,r]=a.useState(()=>tt()),[o,h]=a.useState(!1),[s,w]=a.useState(()=>tt()),[A,N]=a.useState(!1),[z,M]=a.useState(()=>!tt()),[S,D]=a.useState(()=>Ds()),[f,g]=a.useState(null),[d,l]=a.useState(()=>Object.fromEntries(je.map(m=>[m.id,Ls()]))),c=a.useCallback((m,k)=>{l(n=>({...n,[m]:{...n[m],...k}}))},[]),b=a.useCallback(()=>{const m=s.trim();js(m),r(m),N(!0),M(!1),setTimeout(()=>N(!1),2500)},[s]),v=a.useCallback(async m=>{if(!t){c(m.id,{error:"Please save your Groq API key first. Get one free at console.groq.com — no credit card required."});return}const k=d[m.id].prompt.trim();if(!(k.length<80)){c(m.id,{isEvaluating:!0,error:null,result:null});try{const n=await Cs(t,m,k);c(m.id,{isEvaluating:!1,result:n}),D(i=>{const u=i[m.id],C=(u?.attempts??0)+1,p=Math.max(u?.bestScore??0,n.totalScore),y=p>=61,x={...i,[m.id]:{completed:y,bestScore:p,attempts:C}};return As(x),x})}catch(n){const i=n instanceof Error?n.message:"Evaluation failed. Check your API key and try again.";c(m.id,{isEvaluating:!1,error:i})}}},[t,d,c]),E=a.useCallback(m=>{const k=d[m].result?.improvedPrompt??"";navigator.clipboard.writeText(k).then(()=>{c(m,{copied:!0}),setTimeout(()=>c(m,{copied:!1}),2200)})},[d,c]),R=je.filter(m=>S[m.id]?.completed).length;return e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"rounded-2xl px-6 py-5",style:{background:"linear-gradient(135deg, rgba(14,165,233,0.09), rgba(56,189,248,0.05))",border:`1.5px solid ${J}25`},children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center",style:{background:`${J}18`},children:e.jsx(Wt,{size:22,style:{color:J}})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold",style:{color:"#1e1b4b"},children:"SISP Prompt Engineering Lab"}),e.jsx("p",{className:"text-xs mt-0.5 leading-5",style:{color:"#0369a1"},children:"MBI800 · Business Information Systems · Strategic IS Planning"}),e.jsx("p",{className:"text-sm mt-2 leading-6",style:{color:"#374151"},children:"Each challenge places you inside a real organisational scenario and asks you to craft a prompt that applies a core SISP concept — not describe it. Your prompt is evaluated across five dimensions by an AI model, giving you immediate, specific feedback on how to think and communicate as a strategic IS practitioner."}),e.jsxs("div",{className:"flex flex-wrap gap-3 mt-3 text-xs",style:{color:"#0369a1"},children:[e.jsx("span",{children:"· 5 scenario-based challenges"}),e.jsx("span",{children:"· AI-evaluated against SISP rubrics"}),e.jsx("span",{children:"· Iterative — revise and resubmit freely"}),e.jsx("span",{children:"· Progress saved locally in your browser"})]})]})]})}),e.jsxs("div",{className:"rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4",style:{background:"rgba(255,255,255,0.85)",border:"1.5px solid rgba(139,92,246,0.10)"},children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider mb-2",style:{color:"#9ca3af"},children:"Your Progress"}),e.jsx("div",{className:"flex gap-2 flex-wrap",children:je.map(m=>{const k=S[m.id],n=k?.completed,i=(k?.attempts??0)>0;return e.jsxs("button",{onClick:()=>g(u=>u===m.id?null:m.id),className:"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",style:{background:n?"rgba(16,185,129,0.12)":i?`${m.accentColor}12`:"rgba(0,0,0,0.04)",color:n?"#10b981":i?m.accentColor:"#9ca3af",border:`1.5px solid ${n?"rgba(16,185,129,0.3)":i?m.accentColor+"30":"transparent"}`},children:[n?e.jsx(pt,{size:12}):e.jsx(Et,{size:12}),m.number,". ",m.concept,k?.bestScore?` · ${k.bestScore}`:""]},m.id)})})]}),e.jsxs("div",{className:"text-center sm:text-right flex-shrink-0",children:[e.jsxs("p",{className:"text-2xl font-bold",style:{color:R>0?"#10b981":"#9ca3af"},children:[R,e.jsx("span",{className:"text-base font-normal",style:{color:"#9ca3af"},children:"/5"})]}),e.jsx("p",{className:"text-xs",style:{color:"#9ca3af"},children:"completed"})]})]}),e.jsxs("div",{className:"rounded-2xl overflow-hidden",style:{border:`1.5px solid ${t?"rgba(16,185,129,0.25)":"rgba(234,179,8,0.35)"}`},children:[e.jsxs("button",{onClick:()=>M(m=>!m),className:"w-full flex items-center justify-between px-5 py-3 transition-all",style:{background:t?"rgba(16,185,129,0.05)":"rgba(234,179,8,0.06)"},children:[e.jsxs("span",{className:"flex items-center gap-2 text-xs font-bold uppercase tracking-wider",style:{color:t?"#10b981":"#d97706"},children:[e.jsx(Ut,{size:13}),t?"Groq API Key · Configured":"Groq API Key · Required to Evaluate (100% Free)",A&&e.jsx(lt,{size:13})]}),e.jsx(Y,{size:16,style:{color:t?"#10b981":"#d97706",transform:z?"rotate(180deg)":"none",transition:"transform 0.2s"}})]}),z&&e.jsxs("div",{className:"px-5 pb-5 pt-3 animate-fadeIn",style:{borderTop:`1px solid ${t?"rgba(16,185,129,0.15)":"rgba(234,179,8,0.2)"}`},children:[e.jsxs("p",{className:"text-xs leading-5 mb-3",style:{color:"#6b7280"},children:["This lab uses the ",e.jsx("strong",{children:"Groq API"})," — completely free, no credit card required, no usage fees. Your key is stored only in this browser's localStorage and sent only to Groq's servers during evaluation. Get a free key at"," ",e.jsx("a",{href:"https://console.groq.com/keys",target:"_blank",rel:"noreferrer",className:"font-semibold underline",style:{color:J},children:"console.groq.com/keys"})," ","(sign up with email or Google, then click ",e.jsx("em",{children:"Create API key"}),"). Your key will start with ",e.jsx("code",{className:"font-mono",children:"gsk_"}),"."]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx("input",{type:o?"text":"password",value:s,onChange:m=>w(m.target.value),placeholder:"gsk_…",className:"w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-10",style:{border:"1.5px solid rgba(139,92,246,0.20)",background:"rgba(255,255,255,0.9)",color:"#1e1b4b"}}),e.jsx("button",{onClick:()=>h(m=>!m),className:"absolute right-3 top-1/2 -translate-y-1/2",style:{color:"#9ca3af"},children:o?e.jsx(Dt,{size:15}):e.jsx(xt,{size:15})})]}),e.jsx("button",{onClick:b,className:"btn-primary flex-shrink-0",children:A?e.jsxs(e.Fragment,{children:[e.jsx(lt,{size:14})," Saved"]}):"Save Key"})]})]})]}),e.jsx("div",{className:"space-y-3",children:je.map(m=>e.jsx(Ps,{challenge:m,isOpen:f===m.id,onToggle:()=>g(k=>k===m.id?null:m.id),progress:S[m.id],state:d[m.id],onPromptChange:k=>c(m.id,{prompt:k}),onEvaluate:()=>v(m),onToggleImproved:()=>c(m.id,{showImproved:!d[m.id].showImproved}),onCopy:()=>E(m.id),onRetry:()=>c(m.id,{result:null,showImproved:!1,error:null})},m.id))}),R===je.length&&e.jsxs("div",{className:"rounded-2xl px-6 py-5 text-center animate-scaleIn",style:{background:"linear-gradient(135deg, rgba(16,185,129,0.10), rgba(5,150,105,0.06))",border:"1.5px solid rgba(16,185,129,0.30)"},children:[e.jsx(Ie,{size:28,style:{color:"#10b981",margin:"0 auto 8px"}}),e.jsx("p",{className:"text-sm font-bold",style:{color:"#065f46"},children:"All challenges completed!"}),e.jsx("p",{className:"text-xs mt-1",style:{color:"#047857"},children:"You've worked through all five SISP concept areas. Review your best scores above and reflect on which dimensions you found most challenging."})]})]})}const Ye=[{id:0,theme:"Library Management",company:"City Public Library",caseStudy:"You have been hired as a database developer for the City Public Library. They need a digital system to manage and track their entire book collection. Your task is to design and build the database from scratch using MySQL Workbench.",dbName:"library_db",tableName:"books",columns:[{name:"book_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"title",definition:"VARCHAR(100) NOT NULL"},{name:"author",definition:"VARCHAR(80) NOT NULL"},{name:"genre",definition:"VARCHAR(40)"},{name:"year_published",definition:"INT",numericType:!0}],sampleData:[["The Great Gatsby","F. Scott Fitzgerald","Classic","1925"],["To Kill a Mockingbird","Harper Lee","Drama","1960"],["Harry Potter","J.K. Rowling","Fantasy","1997"]],selectTask:"Retrieve all book records from the books table"},{id:1,theme:"Hospital Patient Records",company:"Greenfield General Hospital",caseStudy:"You are a database developer for Greenfield General Hospital. The hospital needs a system to manage patient admission records. Your task is to create the database and patient table to help the hospital organise their data.",dbName:"hospital_db",tableName:"patients",columns:[{name:"patient_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"full_name",definition:"VARCHAR(100) NOT NULL"},{name:"age",definition:"INT NOT NULL",numericType:!0},{name:"blood_type",definition:"VARCHAR(5)"},{name:"admission_date",definition:"DATE"}],sampleData:[["Alice Johnson","34","A+","2024-01-15"],["Bob Martinez","52","O-","2024-01-17"],["Carol White","28","B+","2024-01-20"]],selectTask:"Retrieve all patient records from the patients table"},{id:2,theme:"School Enrollment",company:"Sunrise Academy",caseStudy:"Sunrise Academy has asked you to build a student enrollment database system. This will help the school keep track of enrolled students across different grade levels. Set up the database and the student records table.",dbName:"school_db",tableName:"students",columns:[{name:"student_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"first_name",definition:"VARCHAR(50) NOT NULL"},{name:"last_name",definition:"VARCHAR(50) NOT NULL"},{name:"grade_level",definition:"INT NOT NULL",numericType:!0},{name:"enrollment_date",definition:"DATE"}],sampleData:[["Emma","Thompson","9","2024-02-01"],["Liam","Garcia","10","2024-02-01"],["Olivia","Chen","11","2024-02-03"]],selectTask:"Retrieve all enrolled student records from the students table"},{id:3,theme:"Online Bookstore",company:"PageTurner Online Store",caseStudy:"PageTurner Online Store is launching their e-commerce platform and needs a database to manage their product catalogue. You have been tasked with setting up the initial inventory database system in MySQL.",dbName:"bookstore_db",tableName:"products",columns:[{name:"product_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"product_name",definition:"VARCHAR(100) NOT NULL"},{name:"price",definition:"DECIMAL(10,2) NOT NULL",numericType:!0},{name:"stock_quantity",definition:"INT NOT NULL",numericType:!0},{name:"category",definition:"VARCHAR(50)"}],sampleData:[["Clean Code","29.99","50","Technology"],["Atomic Habits","24.99","75","Self-Help"],["Sapiens","19.99","40","History"]],selectTask:"Retrieve all products from the inventory table"},{id:4,theme:"Hotel Reservations",company:"Sunset Grand Hotel",caseStudy:"Sunset Grand Hotel is modernising their reservation system. They need a database to store guest booking details. Build the reservation database to help the hotel manage their bookings more efficiently.",dbName:"hotel_db",tableName:"reservations",columns:[{name:"reservation_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"guest_name",definition:"VARCHAR(100) NOT NULL"},{name:"room_number",definition:"INT NOT NULL",numericType:!0},{name:"check_in_date",definition:"DATE NOT NULL"},{name:"total_nights",definition:"INT NOT NULL",numericType:!0}],sampleData:[["David Kim","201","2024-03-10","3"],["Sarah Brown","105","2024-03-12","5"],["Michael Lee","310","2024-03-15","2"]],selectTask:"Retrieve all reservation records from the reservations table"},{id:5,theme:"Restaurant Menu",company:"The Spice Garden Restaurant",caseStudy:"The Spice Garden Restaurant wants to digitalise their menu management system. They need a database to store all menu items, prices, and availability status. Help them build a structured database from scratch.",dbName:"restaurant_db",tableName:"menu_items",columns:[{name:"item_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"item_name",definition:"VARCHAR(80) NOT NULL"},{name:"price",definition:"DECIMAL(8,2) NOT NULL",numericType:!0},{name:"category",definition:"VARCHAR(40) NOT NULL"},{name:"is_available",definition:"BOOLEAN DEFAULT TRUE",boolType:!0}],sampleData:[["Grilled Chicken","18.50","Main Course","TRUE"],["Caesar Salad","12.00","Starter","TRUE"],["Chocolate Lava Cake","9.50","Dessert","FALSE"]],selectTask:"Retrieve all menu items from the menu_items table"},{id:6,theme:"Employee Management",company:"TechCorp Ltd.",caseStudy:"TechCorp Ltd. is building an internal HR system and needs a database to manage their employee records. You have been brought in to design and implement the initial employee database in MySQL.",dbName:"company_db",tableName:"employees",columns:[{name:"employee_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"full_name",definition:"VARCHAR(100) NOT NULL"},{name:"department",definition:"VARCHAR(60) NOT NULL"},{name:"salary",definition:"DECIMAL(10,2) NOT NULL",numericType:!0},{name:"hire_date",definition:"DATE"}],sampleData:[["James Wilson","Engineering","85000.00","2021-06-15"],["Priya Patel","Marketing","72000.00","2022-01-10"],["Ryan Nguyen","Human Resources","68000.00","2020-09-01"]],selectTask:"Retrieve all employee records from the employees table"},{id:7,theme:"Student Grade Tracker",company:"Wellington Tech Institute",caseStudy:"Wellington Tech Institute needs a database to record and track student academic results. You are tasked with creating the database system that will store examination scores and grades for all students.",dbName:"grades_db",tableName:"results",columns:[{name:"result_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"student_name",definition:"VARCHAR(100) NOT NULL"},{name:"subject",definition:"VARCHAR(60) NOT NULL"},{name:"score",definition:"INT NOT NULL",numericType:!0},{name:"grade",definition:"VARCHAR(2) NOT NULL"}],sampleData:[["Amy Foster","Mathematics","88","B+"],["Jake Rivera","Physics","95","A"],["Nina Okafor","Chemistry","74","B-"]],selectTask:"Retrieve all student result records from the results table"},{id:8,theme:"Gym Membership",company:"FitLife Gym",caseStudy:"FitLife Gym is expanding and needs a database to track member subscriptions. Your job is to create a membership management database that stores member details and subscription fee information.",dbName:"gym_db",tableName:"members",columns:[{name:"member_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"member_name",definition:"VARCHAR(100) NOT NULL"},{name:"membership_type",definition:"VARCHAR(30) NOT NULL"},{name:"start_date",definition:"DATE NOT NULL"},{name:"monthly_fee",definition:"DECIMAL(8,2) NOT NULL",numericType:!0}],sampleData:[["Chris Evans","Premium","2024-01-01","79.99"],["Mia Santos","Basic","2024-02-01","39.99"],["Omar Hassan","Premium","2024-01-15","79.99"]],selectTask:"Retrieve all gym member records from the members table"},{id:9,theme:"Car Rental Fleet",company:"DriveEasy Car Rentals",caseStudy:"DriveEasy Car Rentals is building a fleet management system. They need a database to track all vehicles in their rental fleet. Create the database and vehicle table to help them manage their fleet effectively.",dbName:"rental_db",tableName:"vehicles",columns:[{name:"vehicle_id",definition:"INT NOT NULL AUTO_INCREMENT PRIMARY KEY",autoGenerated:!0,numericType:!0},{name:"make",definition:"VARCHAR(50) NOT NULL"},{name:"model",definition:"VARCHAR(50) NOT NULL"},{name:"year",definition:"INT NOT NULL",numericType:!0},{name:"daily_rate",definition:"DECIMAL(8,2) NOT NULL",numericType:!0}],sampleData:[["Toyota","Camry","2022","65.00"],["Honda","Civic","2023","58.00"],["Ford","Mustang","2021","95.00"]],selectTask:"Retrieve all vehicles from the vehicles table"}];function Os(t){const r=t.columns.map(o=>`  ${o.name} ${o.definition}`).join(`,
`);return`USE ${t.dbName};

CREATE TABLE ${t.tableName} (
${r}
);`}function Fs(t){const r=t.columns.filter(s=>!s.autoGenerated),o=r.map(s=>s.name).join(", "),h=t.sampleData.map(s=>`  (${s.map((A,N)=>{const z=r[N];return z.numericType||z.boolType?A:`'${A}'`}).join(", ")})`);return`USE ${t.dbName};

INSERT INTO ${t.tableName} (${o})
VALUES
${h.join(`,
`)};`}function Ws(t){return`USE ${t.dbName};

SELECT * FROM ${t.tableName};`}const Q=["createDb","createTable","insertData","retrieveData"],qe={createDb:{label:"Create Database",num:1},createTable:{label:"Create Table",num:2},insertData:{label:"Insert Data",num:3},retrieveData:{label:"Retrieve Data",num:4}},W="#7c3aed";let Me=null;function Us({code:t}){return e.jsx("pre",{style:{background:"#1e1b4b",color:"#c4b5fd",borderRadius:8,padding:"14px 16px",fontSize:13,lineHeight:1.6,overflowX:"auto",margin:"10px 0 0",fontFamily:"'Fira Code', 'Cascadia Code', monospace",whiteSpace:"pre"},children:e.jsx("code",{children:t})})}function Ys(t,r){return t==="createDb"?`CREATE DATABASE ${r.dbName};`:t==="createTable"?Os(r):t==="insertData"?Fs(r):Ws(r)}function Lt(t,r){return t==="createDb"?`Create a new MySQL database named \`${r.dbName}\` using MySQL Workbench.`:t==="createTable"?`Inside \`${r.dbName}\`, create a table named \`${r.tableName}\` with the following columns:`:t==="insertData"?`Insert the following 3 rows of sample data into the \`${r.tableName}\` table:`:`Write and run a SELECT query to ${r.selectTask.toLowerCase()}.`}function qs(t){return t?(t.toDate?t.toDate():new Date(t)).toLocaleDateString("en-NZ",{day:"numeric",month:"short",year:"numeric"}):""}const _s="READY";function Bt(t){return`sql_lab_unlocked_${t}`}function Hs({uid:t,onUnlock:r}){const[o,h]=a.useState(""),[s,w]=a.useState(!1),A=()=>{o.trim()===_s?(localStorage.setItem(Bt(t),"1"),r()):(w(!0),h(""))};return e.jsx("div",{className:"flex flex-col items-center justify-center py-12 px-4 text-center",children:e.jsxs("div",{className:"rounded-xl p-8 w-full max-w-sm",style:{border:"1px solid rgba(124,58,237,0.2)",background:"linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.03))"},children:[e.jsx(he,{size:32,className:"mx-auto mb-4",style:{color:W}}),e.jsx("p",{className:"text-base font-bold mb-1",style:{color:"#1e1b4b"},children:"Lab Access Required"}),e.jsx("p",{className:"text-sm mb-6",style:{color:"#6b7280"},children:"Enter the password provided by your lecturer to unlock this lab."}),e.jsx("input",{type:"text",value:o,onChange:N=>{h(N.target.value),w(!1)},onKeyDown:N=>N.key==="Enter"&&A(),placeholder:"Enter password…",autoFocus:!0,className:"w-full text-center text-sm rounded-lg px-3 py-2.5 outline-none mb-3",style:{border:`1px solid ${s?"#ef4444":"rgba(124,58,237,0.25)"}`,background:"#fff",letterSpacing:"0.1em"}}),s&&e.jsx("p",{className:"text-xs mb-3",style:{color:"#ef4444"},children:"Incorrect password. Try again."}),e.jsx("button",{onClick:A,className:"w-full text-sm font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90",style:{background:W,color:"#fff"},children:"Unlock Lab"})]})})}function Ks(){const{user:t,studentProfile:r}=me(),[o,h]=a.useState(()=>t?localStorage.getItem(Bt(t.uid))==="1":!1),[s,w]=a.useState(null),[A,N]=a.useState(!0),[z,M]=a.useState(null),[S,D]=a.useState(null);if(!o)return e.jsx(Hs,{uid:t.uid,onUnlock:()=>h(!0)});a.useEffect(()=>{if(!t)return;let b=!1;return(async()=>{const v=$(U,"sqlPractice",t.uid),E=await Re(v);if(!b){if(E.exists())w(E.data());else{const m={scenarioId:Math.floor(Math.random()*Ye.length),assignedAt:se(),studentName:r?.fullName??t.email??"",studentId:r?.studentId??"",tasks:{createDb:!1,createTable:!1,insertData:!1,retrieveData:!1},verifications:{}};await Te(v,m),b||w({...m,assignedAt:null})}b||N(!1)}})(),()=>{b=!0}},[t]);const f=async b=>{if(!(!t||!s))if(S===b){M(b),D(null);try{await He($(U,"sqlPractice",t.uid),{[`tasks.${b}`]:!0}),w(v=>v&&{...v,tasks:{...v.tasks,[b]:!0}})}finally{M(null)}}else D(b)};if(A)return e.jsxs("div",{className:"flex items-center justify-center py-12 text-purple-600",children:[e.jsx(Ce,{size:20,className:"animate-spin mr-2"}),e.jsx("span",{className:"text-sm",children:"Loading your scenario…"})]});if(!s)return null;const g=Ye[s.scenarioId],d=Q.filter(b=>s.tasks[b]).length,l=d===4,c=Q.findIndex(b=>!s.tasks[b]);return e.jsxs("div",{className:"space-y-5 py-2",children:[e.jsxs("div",{className:"rounded-xl p-5",style:{background:"linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.04))",border:"1px solid rgba(124,58,237,0.15)"},children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"rounded-lg p-2 flex-shrink-0",style:{background:"rgba(124,58,237,0.12)"},children:e.jsx(Ht,{size:18,style:{color:W}})}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wider mb-1",style:{color:W},children:["Your Scenario — ",g.theme]}),e.jsxs("p",{className:"text-xs font-medium mb-2",style:{color:"#6b7280"},children:["Client: ",g.company]}),e.jsx("p",{className:"text-sm leading-relaxed",style:{color:"#374151"},children:g.caseStudy})]})]}),e.jsxs("div",{className:"mt-4 flex items-center gap-2",children:[e.jsx("div",{className:"flex gap-1",children:Q.map(b=>e.jsx("div",{className:"w-8 h-1.5 rounded-full",style:{background:s.tasks[b]?W:"rgba(124,58,237,0.2)"}},b))}),e.jsxs("span",{className:"text-xs",style:{color:"#9ca3af"},children:[d,"/4 tasks completed"]})]})]}),Q.map((b,v)=>{const E=s.tasks[b],R=!E&&v>c,m=s.verifications[b],k=qe[b];return R?null:e.jsxs("div",{className:"rounded-xl overflow-hidden",style:{border:E?"1px solid rgba(124,58,237,0.25)":"1px solid rgba(124,58,237,0.3)",background:E?"rgba(124,58,237,0.04)":"#fff"},children:[e.jsxs("div",{className:"flex items-center justify-between px-5 py-3",style:{background:E?"rgba(124,58,237,0.07)":"rgba(124,58,237,0.04)",borderBottom:"1px solid rgba(124,58,237,0.12)"},children:[e.jsxs("div",{className:"flex items-center gap-2",children:[E?e.jsx(K,{size:17,style:{color:"#059669"}}):e.jsx(Et,{size:17,style:{color:W}}),e.jsxs("span",{className:"text-sm font-semibold",style:{color:"#1e1b4b"},children:["Task ",k.num," of 4 — ",k.label]})]}),E&&m&&e.jsxs("div",{className:"flex items-center gap-1.5 text-xs",style:{color:"#059669"},children:[e.jsx(ge,{size:13}),e.jsxs("span",{children:["Verified by ",m.verifiedByName]})]}),E&&!m&&e.jsx("span",{className:"text-xs",style:{color:"#9ca3af"},children:"Awaiting TA verification"})]}),e.jsxs("div",{className:"px-5 py-4 space-y-3",children:[e.jsx("p",{className:"text-sm",style:{color:"#374151"},children:Lt(b,g)}),b==="createTable"&&e.jsx("ul",{className:"text-sm space-y-1 pl-1",children:g.columns.map(n=>e.jsxs("li",{className:"flex items-baseline gap-2",children:[e.jsx("span",{className:"font-mono text-xs px-1.5 py-0.5 rounded",style:{background:"rgba(124,58,237,0.1)",color:W},children:n.name}),e.jsx("span",{className:"text-xs",style:{color:"#6b7280"},children:n.definition})]},n.name))}),b==="insertData"&&e.jsx("div",{className:"overflow-x-auto rounded-lg",style:{border:"1px solid rgba(124,58,237,0.15)"},children:e.jsxs("table",{className:"w-full text-xs",children:[e.jsx("thead",{children:e.jsx("tr",{style:{background:"rgba(124,58,237,0.08)"},children:g.columns.filter(n=>!n.autoGenerated).map(n=>e.jsx("th",{className:"px-3 py-2 text-left font-semibold",style:{color:W},children:n.name},n.name))})}),e.jsx("tbody",{children:g.sampleData.map((n,i)=>e.jsx("tr",{style:{borderTop:"1px solid rgba(124,58,237,0.08)",background:i%2===1?"rgba(124,58,237,0.02)":"transparent"},children:n.map((u,C)=>e.jsx("td",{className:"px-3 py-2",style:{color:"#374151"},children:u},C))},i))})]})}),!E&&e.jsx("div",{className:"pt-1 flex items-center gap-3",children:S===b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"text-xs",style:{color:"#6b7280"},children:"Have you completed this task in MySQL Workbench?"}),e.jsxs("button",{onClick:()=>f(b),disabled:z===b,className:"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg",style:{background:"#059669",color:"#fff"},children:[z===b?e.jsx(Ce,{size:13,className:"animate-spin"}):e.jsx(K,{size:13}),"Yes, mark done"]}),e.jsx("button",{onClick:()=>D(null),className:"text-xs px-3 py-1.5 rounded-lg",style:{background:"#f3f4f6",color:"#6b7280"},children:"Cancel"})]}):e.jsxs("button",{onClick:()=>f(b),disabled:z!==null,className:"flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90",style:{background:W,color:"#fff"},children:[e.jsx(K,{size:15}),"Mark as Done"]})}),E&&e.jsxs("div",{className:"flex items-center gap-2 pt-1",children:[e.jsx(K,{size:15,style:{color:"#059669"}}),e.jsx("span",{className:"text-sm font-medium",style:{color:"#059669"},children:"Completed"})]})]})]},b)}),c!==-1&&c<3&&e.jsxs("div",{className:"rounded-xl px-5 py-3 flex items-center gap-2",style:{background:"#f9fafb",border:"1px dashed #e5e7eb"},children:[e.jsx(he,{size:14,style:{color:"#9ca3af"}}),e.jsxs("span",{className:"text-xs",style:{color:"#9ca3af"},children:[3-c," more task",3-c!==1?"s":""," will unlock as you complete each step."]})]}),l&&e.jsxs("div",{className:"rounded-xl p-5 text-center",style:{background:"linear-gradient(135deg, rgba(5,150,105,0.08), rgba(16,185,129,0.04))",border:"1px solid rgba(5,150,105,0.2)"},children:[e.jsx(K,{size:32,className:"mx-auto mb-2",style:{color:"#059669"}}),e.jsx("p",{className:"text-base font-bold",style:{color:"#065f46"},children:"All tasks completed!"}),e.jsx("p",{className:"text-sm mt-1",style:{color:"#6b7280"},children:"Your teaching assistant will review and verify each task."})]})]})}function Gs({done:t,verified:r}){return t?e.jsxs("span",{className:"inline-flex items-center gap-1",children:[e.jsx(K,{size:13,style:{color:"#059669"}}),r&&e.jsx(ge,{size:11,style:{color:"#7c3aed"}})]}):e.jsx("span",{className:"text-xs text-gray-300",children:"—"})}function Qs({record:t,currentUserName:r,onUpdate:o,onClose:h}){const[s,w]=a.useState(null),A=Ye[t.scenarioId],N=async z=>{const M=t.verifications[z];w(z);const S=M?null:{verifiedByName:r,verifiedAt:se()};try{await He($(U,"sqlPractice",t.uid),{[`verifications.${z}`]:S}),o(t.uid,z,S)}finally{w(null)}};return e.jsxs("div",{className:"mt-3 rounded-xl overflow-hidden",style:{border:"1px solid rgba(124,58,237,0.2)",background:"#fafafa"},children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-3",style:{background:"rgba(124,58,237,0.06)",borderBottom:"1px solid rgba(124,58,237,0.12)"},children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-sm font-semibold",style:{color:"#1e1b4b"},children:t.studentName||"Unknown"}),t.studentId&&e.jsxs("span",{className:"ml-2 text-xs",style:{color:"#9ca3af"},children:["#",t.studentId]}),e.jsx("span",{className:"ml-3 text-xs px-2 py-0.5 rounded-full",style:{background:"rgba(124,58,237,0.1)",color:W},children:A.theme})]}),e.jsx("button",{onClick:h,className:"text-gray-400 hover:text-gray-600",children:e.jsx(Le,{size:18})})]}),e.jsxs("div",{className:"px-4 py-3",style:{borderBottom:"1px solid rgba(124,58,237,0.08)"},children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wider mb-1",style:{color:W},children:["Scenario — ",A.company]}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:A.caseStudy})]}),e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(124,58,237,0.08)"},children:Q.map((z,M)=>{const S=t.tasks[z],D=t.verifications[z],f=qe[z];return e.jsx("div",{className:"px-4 py-3",children:e.jsxs("div",{className:"flex items-start justify-between gap-4",children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("span",{className:"text-xs font-semibold",style:{color:"#374151"},children:["Task ",f.num,": ",f.label]}),S?e.jsx("span",{className:"text-xs px-1.5 py-0.5 rounded",style:{background:"#dcfce7",color:"#166534"},children:"Student done"}):e.jsx("span",{className:"text-xs px-1.5 py-0.5 rounded",style:{background:"#f3f4f6",color:"#9ca3af"},children:"Not done yet"})]}),e.jsx("p",{className:"text-xs mb-2",style:{color:"#6b7280"},children:Lt(z,A)}),e.jsx(Us,{code:Ys(z,A)}),D&&e.jsxs("p",{className:"text-xs mt-2",style:{color:"#7c3aed"},children:[e.jsx(ge,{size:11,className:"inline mr-1"}),"Verified by ",D.verifiedByName,D.verifiedAt&&` · ${qs(D.verifiedAt)}`]})]}),e.jsx("div",{className:"flex-shrink-0 pt-1",children:e.jsx("button",{onClick:()=>N(z),disabled:s===z||!S,className:"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40",style:{background:D?"rgba(124,58,237,0.1)":W,color:D?W:"#fff",border:D?`1px solid ${W}`:"none"},title:S?"":"Student has not completed this task yet",children:s===z?e.jsx(Ce,{size:12,className:"animate-spin"}):D?e.jsxs(e.Fragment,{children:[e.jsx(ge,{size:12})," Verified"]}):e.jsxs(e.Fragment,{children:[e.jsx(ge,{size:12})," Verify"]})})})]})},z)})})]})}function Zs({isLecturer:t}){const{user:r,studentProfile:o}=me(),[h,s]=a.useState(null),[w,A]=a.useState(!1),[N,z]=a.useState(!1),[M,S]=a.useState(null),[D,f]=a.useState(""),g=r?.displayName||o?.fullName||r?.email||"Staff",d=async()=>{if(Me){s(Me),z(!0);return}A(!0);try{const E=(await Mt(ze(U,"sqlPractice"))).docs.map(R=>({uid:R.id,...R.data()}));E.sort((R,m)=>(R.studentName||"").localeCompare(m.studentName||"")),Me=E,s(E)}finally{A(!1),z(!0)}},l=(v,E,R)=>{s(m=>{if(!m)return m;const k=m.map(n=>n.uid===v?{...n,verifications:{...n.verifications,[E]:R}}:n);return Me=k,k})},c=h?Q.map(v=>({key:v,label:qe[v].label,studentDone:h.filter(E=>E.tasks[v]).length,taVerified:h.filter(E=>!!E.verifications[v]).length,total:h.length})):null,b=h?h.filter(v=>{const E=D.toLowerCase();return!E||v.studentName?.toLowerCase().includes(E)||v.studentId?.toLowerCase().includes(E)}):[];return e.jsx("div",{className:"space-y-4 py-2",children:N?e.jsxs(e.Fragment,{children:[t&&c&&e.jsxs("div",{className:"rounded-xl p-4",style:{background:"linear-gradient(135deg, rgba(124,58,237,0.07), rgba(167,139,250,0.03))",border:"1px solid rgba(124,58,237,0.15)"},children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wider mb-3",style:{color:W},children:["Summary — ",h.length," student",h.length!==1?"s":""," started"]}),e.jsx("div",{className:"grid grid-cols-2 gap-3 sm:grid-cols-4",children:c.map(v=>e.jsxs("div",{className:"rounded-lg p-3",style:{background:"rgba(255,255,255,0.7)",border:"1px solid rgba(124,58,237,0.1)"},children:[e.jsx("p",{className:"text-xs font-medium mb-2",style:{color:"#374151"},children:v.label}),e.jsxs("p",{className:"text-lg font-bold leading-none",style:{color:W},children:[v.studentDone,e.jsxs("span",{className:"text-sm font-normal text-gray-400",children:["/",v.total]})]}),e.jsxs("p",{className:"text-xs mt-1",style:{color:"#9ca3af"},children:[e.jsx(ge,{size:10,className:"inline mr-0.5"}),v.taVerified," verified"]})]},v.key))})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text",value:D,onChange:v=>f(v.target.value),placeholder:"Search by name or student ID…",className:"flex-1 text-sm rounded-lg px-3 py-2 outline-none",style:{border:"1px solid rgba(124,58,237,0.2)",background:"#fff"}}),e.jsx("button",{onClick:()=>{Me=null,s(null),z(!1),S(null)},className:"text-xs px-3 py-2 rounded-lg",style:{background:"#f3f4f6",color:"#6b7280",border:"1px solid #e5e7eb"},children:"Refresh"})]}),b.length===0?e.jsx("p",{className:"text-sm text-center py-6",style:{color:"#9ca3af"},children:D?"No students match your search.":"No students have started this lesson yet."}):e.jsx("div",{className:"space-y-2",children:b.map(v=>{const E=M===v.uid,R=Q.every(n=>v.tasks[n]);Q.every(n=>!!v.verifications[n]);const m=Q.filter(n=>v.tasks[n]).length,k=Q.filter(n=>!!v.verifications[n]).length;return e.jsxs("div",{className:"rounded-xl overflow-hidden",style:{border:"1px solid rgba(124,58,237,0.15)"},children:[e.jsxs("button",{onClick:()=>S(E?null:v.uid),className:"w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-50 transition-colors",style:{background:E?"rgba(124,58,237,0.06)":"#fff"},children:[e.jsx("div",{className:"flex items-center gap-3 min-w-0",children:e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-sm font-semibold truncate",style:{color:"#1e1b4b"},children:v.studentName||"(No name)"}),e.jsxs("p",{className:"text-xs",style:{color:"#9ca3af"},children:[v.studentId?`#${v.studentId} · `:"",Ye[v.scenarioId]?.theme]})]})}),e.jsxs("div",{className:"flex items-center gap-4 flex-shrink-0 ml-3",children:[e.jsx("div",{className:"hidden sm:flex items-center gap-3",children:Q.map(n=>e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx(Gs,{done:v.tasks[n],verified:!!v.verifications[n]}),e.jsx("span",{className:"text-xs mt-0.5",style:{color:"#d1d5db",fontSize:9},children:qe[n].label.split(" ")[0]})]},n))}),e.jsxs("span",{className:"sm:hidden text-xs px-2 py-0.5 rounded-full",style:{background:R?"#dcfce7":"rgba(124,58,237,0.1)",color:R?"#166534":W},children:[m,"/4"]}),k>0&&e.jsxs("span",{className:"text-xs px-2 py-0.5 rounded-full",style:{background:"rgba(124,58,237,0.1)",color:W},children:[e.jsx(ge,{size:10,className:"inline mr-0.5"}),k,"/4"]}),E?e.jsx(te,{size:16,className:"text-gray-400"}):e.jsx(Y,{size:16,className:"text-gray-400"})]})]}),E&&e.jsx("div",{className:"px-4 pb-4",children:e.jsx(Qs,{record:v,currentUserName:g,onUpdate:l,onClose:()=>S(null)})})]},v.uid)})})]}):e.jsxs("div",{className:"text-center py-8",children:[e.jsx("p",{className:"text-sm mb-4",style:{color:"#6b7280"},children:"View student progress and verify completed tasks."}),e.jsxs("button",{onClick:d,disabled:w,className:"flex items-center gap-2 mx-auto text-sm font-semibold px-5 py-2.5 rounded-lg",style:{background:W,color:"#fff"},children:[w?e.jsx(Ce,{size:15,className:"animate-spin"}):e.jsx(Be,{size:15}),w?"Loading…":"Load Student Progress"]})]})})}function Vs(){const{role:t}=me();return t==="lecturer"||t==="teachingAssistant"?e.jsx(Zs,{isLecturer:t==="lecturer"}):e.jsx(Ks,{})}const Js=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

.scrum *{box-sizing:border-box;margin:0;padding:0}
.scrum{font-family:'DM Sans',sans-serif;--title:64px;--subtitle:44px;--body:32px;--small:26px;--tiny:23px;--px:100px;--pt:80px;--pb:68px;--title-gap:40px;--item-gap:22px;--navy:#0d1b2a;--navy2:#052e16;--green:#059669;--green2:#10b981;--green-light:#d1fae5;--green-dark:#065f46;--cyan:#0891b2;--cyan-light:#cffafe;--amber:#d97706;--amber-light:#fef3c7;--purple:#7c3aed;--purple-light:#ede9fe;--red:#dc2626;--red-light:#fee2e2;--white:#f8fafc;--off-white:#f0fdf4;--slate:#64748b;--text:#0f172a}
.scrum section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:var(--text)}
.scrum section.dark{background:var(--navy);color:var(--white)}
.scrum section.dark-green{background:var(--navy2);color:var(--white)}
.scrum .slide-title{font-size:var(--title);font-weight:700;line-height:1.1;letter-spacing:-0.02em;margin-bottom:var(--title-gap);text-wrap:pretty}
.scrum .slide-title .accent{color:var(--green)}
.scrum section.dark .slide-title .accent,.scrum section.dark-green .slide-title .accent{color:#34d399}
.scrum .section-label{font-size:var(--small);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--green);margin-bottom:18px}
.scrum section.dark .section-label,.scrum section.dark-green .section-label{color:#34d399}
.scrum .body{font-size:var(--body);line-height:1.55}
.scrum .small{font-size:var(--small);line-height:1.5}
.scrum .tiny{font-size:var(--tiny);line-height:1.5}
.scrum .two-col{display:grid;grid-template-columns:1fr 1fr;gap:44px;flex:1;align-items:start}
.scrum .two-col.wide{grid-template-columns:1.15fr 0.85fr}
.scrum .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;flex:1;align-items:stretch}
.scrum .four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;flex:1;align-items:stretch}
.scrum .callout{border-radius:16px;padding:22px 30px;font-size:var(--body);line-height:1.5}
.scrum .callout-green{background:var(--green-light);border-left:6px solid var(--green)}
.scrum .callout-cyan{background:var(--cyan-light);border-left:6px solid var(--cyan)}
.scrum .callout-amber{background:var(--amber-light);border-left:6px solid var(--amber)}
.scrum .callout-purple{background:var(--purple-light);border-left:6px solid var(--purple)}
.scrum .callout-red{background:var(--red-light);border-left:6px solid var(--red)}
.scrum .badge{display:inline-block;font-size:var(--tiny);font-weight:700;padding:6px 20px;border-radius:999px;letter-spacing:0.04em}
.scrum .badge-green{background:var(--green);color:#fff}
.scrum .badge-cyan{background:var(--cyan);color:#fff}
.scrum .badge-amber{background:var(--amber);color:#fff}
.scrum .badge-purple{background:var(--purple);color:#fff}
.scrum .badge-red{background:var(--red);color:#fff}
.scrum table{border-collapse:collapse;font-size:var(--small);width:100%}
.scrum th{background:var(--navy);color:#fff;padding:13px 20px;text-align:left;font-weight:500;font-size:var(--tiny)}
.scrum td{padding:11px 20px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle}
.scrum tr:nth-child(even) td{background:#f8fafc}
.scrum tr:hover td{background:var(--green-light)}
.scrum .tbl-green th{background:var(--green)}
.scrum .tbl-red th{background:var(--red)}
.scrum .tbl-neutral th{background:#334155}
.scrum .role-card{border-radius:24px;padding:36px 32px;display:flex;flex-direction:column;gap:18px}
.scrum .role-icon{width:68px;height:68px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:34px;flex-shrink:0}
.scrum .role-title{font-size:var(--body);font-weight:700}
.scrum .role-subtitle{font-size:var(--small);opacity:0.72;line-height:1.4}
.scrum ul.check{list-style:none;display:flex;flex-direction:column;gap:9px}
.scrum ul.check li{font-size:var(--small);line-height:1.5;padding-left:32px;position:relative}
.scrum ul.check li::before{content:'✓';position:absolute;left:0;font-weight:700;color:var(--green)}
.scrum section.dark ul.check li::before,.scrum section.dark-green ul.check li::before{color:#34d399}
.scrum ul.dot{list-style:none;display:flex;flex-direction:column;gap:9px}
.scrum ul.dot li{font-size:var(--small);line-height:1.5;padding-left:28px;position:relative}
.scrum ul.dot li::before{content:'';position:absolute;left:0;top:10px;width:14px;height:14px;border-radius:50%;background:var(--green)}
.scrum section.dark ul.dot li::before{background:#34d399}
.scrum .step-list{display:flex;flex-direction:column;gap:14px}
.scrum .step-item{display:flex;gap:18px;align-items:flex-start}
.scrum .step-num{width:42px;height:42px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;margin-top:2px}
.scrum .kanban-col{border-radius:16px;padding:18px 16px;display:flex;flex-direction:column;gap:10px;min-height:0}
.scrum .kanban-card{background:white;border-radius:10px;padding:13px 16px;font-size:var(--tiny);box-shadow:0 2px 8px rgba(0,0,0,0.08);border-left:4px solid;line-height:1.4}
.scrum .main-title{font-size:86px;font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#fff;margin-bottom:28px}
.scrum .main-title span{color:#34d399}
.scrum .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1200px}
.scrum .copyright{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:22px;color:rgba(0,0,0,0.22);letter-spacing:0.04em}
.scrum section.dark .copyright,.scrum section.dark-green .copyright{color:rgba(255,255,255,0.22)}
.scrum .deco-circle{position:absolute;border-radius:50%;pointer-events:none}
.scrum .pillar-card{border-radius:22px;padding:34px 30px;flex:1;display:flex;flex-direction:column;gap:14px}
.scrum .pillar-icon{font-size:52px;line-height:1}
.scrum .pillar-title{font-size:var(--body);font-weight:700}
.scrum .pillar-body{font-size:var(--small);line-height:1.55;opacity:0.85}
.scrum .event-card{border-radius:20px;padding:28px 24px;display:flex;flex-direction:column;gap:10px}
.scrum .event-title{font-size:var(--small);font-weight:700}
.scrum .event-time{font-size:var(--tiny);font-weight:700;padding:4px 14px;border-radius:99px;display:inline-block;margin-bottom:4px}
.scrum .event-desc{font-size:var(--tiny);line-height:1.55;opacity:0.85}
.scrum .artifact-card{border-radius:22px;padding:36px 32px;display:flex;flex-direction:column;gap:16px;height:100%}
.scrum .artifact-icon{font-size:48px;line-height:1}
.scrum .artifact-title{font-size:var(--body);font-weight:700}
.scrum .artifact-def{font-size:var(--small);line-height:1.55;opacity:0.85}
.scrum .manifesto-val{border-radius:20px;padding:28px 30px;display:flex;flex-direction:column;gap:10px}
.scrum .val-over{font-size:var(--tiny);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.6}
.scrum .val-primary{font-size:var(--body);font-weight:700;line-height:1.3}
.scrum .val-secondary{font-size:var(--small);opacity:0.7;line-height:1.4}`,st=[{classes:"dark",label:"1 Agile Scrum – Title",html:`
    <div class="deco-circle" style="width:700px;height:700px;background:radial-gradient(circle,rgba(16,185,129,0.18) 0%,transparent 70%);right:-120px;top:-160px;"></div>
    <div class="deco-circle" style="width:400px;height:400px;background:radial-gradient(circle,rgba(8,145,178,0.14) 0%,transparent 70%);left:-80px;bottom:-80px;"></div>
    <div class="title-slide-inner">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:36px;">
        <div style="width:56px;height:6px;background:#34d399;border-radius:3px;"></div>
        <span style="font-size:var(--small);font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#34d399;">MBI804 · IT Project Management</span>
      </div>
      <div class="main-title">Agile <span>Scrum</span><br/>Process in IT</div>
      <p style="font-size:var(--body);color:rgba(255,255,255,0.65);max-width:900px;line-height:1.6;margin-bottom:52px;">A complete visual guide to Scrum roles, artifacts, events, and the Sprint cycle as used in real-world IT software delivery.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <span class="badge badge-green">Roles &amp; Teams</span>
        <span class="badge badge-cyan">Artifacts</span>
        <span class="badge badge-amber">Ceremonies</span>
        <span class="badge badge-purple">Sprint Cycle</span>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"2 What is Agile?",html:`
    <div class="section-label">Foundations</div>
    <div class="slide-title">What is <span class="accent">Agile?</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:22px;">
        <div class="callout callout-green">
          <strong>Agile</strong> is an iterative approach to software development and project management that helps teams deliver value to customers <em>faster</em> and with <em>fewer headaches</em>.
        </div>
        <div style="font-size:var(--small);line-height:1.7;color:var(--slate);">
          Instead of delivering everything at once at the end of a long project, Agile teams deliver work in small, workable increments — responding to change over following a fixed plan.
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;">
          <span class="badge badge-green">Iterative</span>
          <span class="badge badge-cyan">Collaborative</span>
          <span class="badge badge-amber">Adaptive</span>
          <span class="badge badge-purple">Customer-focused</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.06em;text-transform:uppercase;">Key Agile Characteristics</div>
        <ul class="check" style="gap:16px;">
          <li style="font-size:var(--body);">Short delivery cycles (sprints/iterations)</li>
          <li style="font-size:var(--body);">Continuous feedback from stakeholders</li>
          <li style="font-size:var(--body);">Self-organising, cross-functional teams</li>
          <li style="font-size:var(--body);">Embrace change — even late in development</li>
          <li style="font-size:var(--body);">Working software as the primary measure</li>
        </ul>
        <div class="callout callout-amber" style="margin-top:8px;">
          <strong>Origin:</strong> The Agile Manifesto was written in 2001 by 17 software practitioners in Snowbird, Utah.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"3 Agile Manifesto – 4 Values",html:`
    <div class="deco-circle" style="width:500px;height:500px;background:radial-gradient(circle,rgba(52,211,153,0.12) 0%,transparent 70%);right:-60px;top:-100px;"></div>
    <div class="section-label">Agile Manifesto · 2001</div>
    <div class="slide-title">Four <span class="accent">Core Values</span></div>
    <div class="four-col" style="gap:28px;">
      <div class="manifesto-val" style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(52,211,153,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#34d399;">Individuals &amp; Interactions</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Processes &amp; Tools</div>
      </div>
      <div class="manifesto-val" style="background:rgba(8,145,178,0.15);border:1.5px solid rgba(34,211,238,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#22d3ee;">Working Software</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Comprehensive Documentation</div>
      </div>
      <div class="manifesto-val" style="background:rgba(217,119,6,0.15);border:1.5px solid rgba(251,191,36,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#fbbf24;">Customer Collaboration</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Contract Negotiation</div>
      </div>
      <div class="manifesto-val" style="background:rgba(124,58,237,0.15);border:1.5px solid rgba(167,139,250,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#a78bfa;">Responding to Change</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Following a Plan</div>
      </div>
    </div>
    <div style="margin-top:32px;text-align:center;font-size:var(--small);color:rgba(255,255,255,0.5);font-style:italic;">
      "That is, while there is value in the items on the right, we value the items on the left more."
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"4 Agile vs Waterfall",html:`
    <div class="section-label">Comparison</div>
    <div class="slide-title">Agile vs <span class="accent">Waterfall</span></div>
    <table class="tbl-neutral" style="flex:1;">
      <thead>
        <tr>
          <th style="width:28%;">Aspect</th>
          <th style="background:#dc2626;width:36%;">🌊 Waterfall</th>
          <th style="background:#059669;width:36%;">⚡ Agile</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="font-weight:600;">Delivery approach</td><td>Single delivery at end of project</td><td>Incremental delivery every sprint</td></tr>
        <tr><td style="font-weight:600;">Requirements</td><td>Fixed upfront — changes are costly</td><td>Evolving — change welcomed anytime</td></tr>
        <tr><td style="font-weight:600;">Customer involvement</td><td>At start and end only</td><td>Continuous throughout the project</td></tr>
        <tr><td style="font-weight:600;">Testing phase</td><td>After development is complete</td><td>Continuous — every sprint</td></tr>
        <tr><td style="font-weight:600;">Team structure</td><td>Siloed (Dev, QA, BA separate)</td><td>Cross-functional, self-organising</td></tr>
        <tr><td style="font-weight:600;">Risk management</td><td>Risk discovered late (expensive)</td><td>Risks surfaced early, often</td></tr>
        <tr><td style="font-weight:600;">Best suited for</td><td>Fixed-scope, stable requirements</td><td>Complex, evolving software projects</td></tr>
      </tbody>
    </table>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"5 What is Scrum?",html:`
    <div class="section-label">Scrum Framework</div>
    <div class="slide-title">What is <span class="accent">Scrum?</span></div>
    <div class="two-col wide">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="callout callout-green">
          <strong>Scrum</strong> is a lightweight Agile <em>framework</em> for developing, delivering, and sustaining complex products — most commonly used in software development.
        </div>
        <p style="font-size:var(--body);line-height:1.65;color:var(--slate);">Scrum uses short, fixed-length iterations called <strong>Sprints</strong> (1–4 weeks) where a cross-functional team produces a potentially shippable product increment.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:4px;">
          <div style="background:var(--green-light);border-radius:14px;padding:18px 20px;">
            <div style="font-size:var(--small);font-weight:700;color:var(--green-dark);">📅 Sprint Duration</div>
            <div style="font-size:var(--body);font-weight:700;color:var(--green);">1 – 4 weeks</div>
          </div>
          <div style="background:var(--cyan-light);border-radius:14px;padding:18px 20px;">
            <div style="font-size:var(--small);font-weight:700;color:#0e7490;">👥 Team Size</div>
            <div style="font-size:var(--body);font-weight:700;color:var(--cyan);">3 – 9 members</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">Three Pillars of Scrum</div>
        <div class="pillar-card" style="background:var(--green-light);border:1.5px solid rgba(5,150,105,0.25);flex:0 0 auto;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:40px;">👁️</div>
            <div>
              <div class="pillar-title" style="color:var(--green-dark);">Transparency</div>
              <div class="pillar-body" style="color:var(--green-dark);">All significant aspects of the process must be visible to everyone responsible for the outcome.</div>
            </div>
          </div>
        </div>
        <div class="pillar-card" style="background:var(--amber-light);border:1.5px solid rgba(217,119,6,0.25);flex:0 0 auto;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:40px;">🔍</div>
            <div>
              <div class="pillar-title" style="color:#78350f;">Inspection</div>
              <div class="pillar-body" style="color:#78350f;">Scrum users must frequently inspect progress toward the Sprint Goal to detect undesirable variances.</div>
            </div>
          </div>
        </div>
        <div class="pillar-card" style="background:var(--cyan-light);border:1.5px solid rgba(8,145,178,0.25);flex:0 0 auto;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:40px;">🔄</div>
            <div>
              <div class="pillar-title" style="color:#0e4f5c;">Adaptation</div>
              <div class="pillar-body" style="color:#0e4f5c;">If inspection reveals deviation beyond acceptable limits, the process must be adjusted as soon as possible.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark-green",label:"6 Scrum Framework at a Glance",html:`
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(52,211,153,0.1) 0%,transparent 70%);right:-80px;bottom:-120px;"></div>
    <div class="section-label">Overview</div>
    <div class="slide-title">Scrum <span class="accent">Framework</span> at a Glance</div>

    <div style="display:flex;align-items:center;gap:0;flex:1;margin-top:8px;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:220px;flex-shrink:0;">
        <div style="background:rgba(52,211,153,0.15);border:2px solid rgba(52,211,153,0.4);border-radius:18px;padding:24px 20px;text-align:center;width:100%;">
          <div style="font-size:42px;">📋</div>
          <div style="font-size:var(--small);font-weight:700;color:#34d399;margin-top:8px;">Product</div>
          <div style="font-size:var(--small);font-weight:700;color:#34d399;">Backlog</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);margin-top:6px;">Prioritised list of all work</div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:210px;flex-shrink:0;">
        <div style="background:rgba(251,191,36,0.15);border:2px solid rgba(251,191,36,0.4);border-radius:18px;padding:24px 20px;text-align:center;width:100%;">
          <div style="font-size:40px;">🗓️</div>
          <div style="font-size:var(--small);font-weight:700;color:#fbbf24;margin-top:8px;">Sprint</div>
          <div style="font-size:var(--small);font-weight:700;color:#fbbf24;">Planning</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);margin-top:6px;">Select &amp; plan sprint work</div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="background:rgba(16,185,129,0.12);border:2.5px solid rgba(52,211,153,0.5);border-radius:22px;padding:28px 24px;flex:1;position:relative;">
        <div style="font-size:var(--small);font-weight:700;color:#34d399;text-align:center;margin-bottom:16px;">⚡ THE SPRINT (1–4 weeks)</div>
        <div style="display:flex;align-items:center;gap:0;justify-content:center;">
          <div style="background:rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;text-align:center;width:200px;">
            <div style="font-size:34px;">📝</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-top:6px;">Sprint Backlog</div>
          </div>
          <div style="font-size:36px;color:#34d399;margin:0 10px;">→</div>
          <div style="background:rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;text-align:center;width:200px;">
            <div style="font-size:34px;">⚙️</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-top:6px;">Dev Work</div>
          </div>
        </div>
        <div style="text-align:center;margin-top:16px;">
          <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(251,191,36,0.15);border-radius:99px;padding:8px 20px;">
            <span style="font-size:26px;">🌅</span>
            <span style="font-size:var(--tiny);font-weight:700;color:#fbbf24;">Daily Scrum · 15 min/day</span>
          </div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="display:flex;flex-direction:column;gap:10px;width:200px;flex-shrink:0;">
        <div style="background:rgba(34,211,238,0.15);border:2px solid rgba(34,211,238,0.4);border-radius:16px;padding:18px 16px;text-align:center;">
          <div style="font-size:32px;">🎯</div>
          <div style="font-size:var(--tiny);font-weight:700;color:#22d3ee;margin-top:6px;">Sprint Review</div>
        </div>
        <div style="background:rgba(167,139,250,0.15);border:2px solid rgba(167,139,250,0.4);border-radius:16px;padding:18px 16px;text-align:center;">
          <div style="font-size:32px;">💡</div>
          <div style="font-size:var(--tiny);font-weight:700;color:#a78bfa;margin-top:6px;">Retrospective</div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="width:200px;flex-shrink:0;">
        <div style="background:rgba(52,211,153,0.18);border:2px solid rgba(52,211,153,0.5);border-radius:18px;padding:24px 20px;text-align:center;">
          <div style="font-size:42px;">🚀</div>
          <div style="font-size:var(--small);font-weight:700;color:#34d399;margin-top:8px;">Increment</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);margin-top:6px;">Shippable product value</div>
        </div>
      </div>

    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"7 Scrum Roles Overview",html:`
    <div class="section-label">People · The Scrum Team</div>
    <div class="slide-title">Three <span class="accent">Scrum Roles</span></div>
    <div class="three-col">
      <div class="role-card" style="background:linear-gradient(135deg,rgba(5,150,105,0.08),rgba(16,185,129,0.04));border:1.5px solid rgba(5,150,105,0.2);">
        <div class="role-icon" style="background:rgba(5,150,105,0.12);font-size:36px;">🏆</div>
        <div>
          <div class="role-title" style="color:var(--green-dark);">Product Owner</div>
          <div class="role-subtitle">Maximises product value</div>
        </div>
        <ul class="dot" style="flex:1;">
          <li>Owns the Product Backlog</li>
          <li>Prioritises features by business value</li>
          <li>Defines acceptance criteria</li>
          <li>Voice of the customer &amp; stakeholders</li>
          <li>Accepts or rejects sprint outcomes</li>
        </ul>
        <div class="callout callout-green" style="font-size:var(--tiny);">
          <strong>Accountability:</strong> Maximising the value of the product resulting from the Scrum Team's work.
        </div>
      </div>

      <div class="role-card" style="background:linear-gradient(135deg,rgba(217,119,6,0.08),rgba(251,191,36,0.04));border:1.5px solid rgba(217,119,6,0.2);">
        <div class="role-icon" style="background:rgba(217,119,6,0.12);font-size:36px;">🛡️</div>
        <div>
          <div class="role-title" style="color:#78350f;">Scrum Master</div>
          <div class="role-subtitle">Servant-leader &amp; coach</div>
        </div>
        <ul class="dot" style="flex:1;">
          <li>Facilitates all Scrum events</li>
          <li>Removes impediments for the team</li>
          <li>Coaches team on Scrum practices</li>
          <li>Shields team from outside interruptions</li>
          <li>Promotes continuous improvement</li>
        </ul>
        <div class="callout callout-amber" style="font-size:var(--tiny);">
          <strong>Accountability:</strong> Ensuring Scrum is understood and enacted — serving the team, PO, and organisation.
        </div>
      </div>

      <div class="role-card" style="background:linear-gradient(135deg,rgba(8,145,178,0.08),rgba(34,211,238,0.04));border:1.5px solid rgba(8,145,178,0.2);">
        <div class="role-icon" style="background:rgba(8,145,178,0.12);font-size:36px;">👩‍💻</div>
        <div>
          <div class="role-title" style="color:#0e4f5c;">Developers</div>
          <div class="role-subtitle">Cross-functional delivery team</div>
        </div>
        <ul class="dot" style="flex:1;">
          <li>Build the product increment each sprint</li>
          <li>Self-organise and manage their own work</li>
          <li>Collectively own code quality</li>
          <li>Estimate effort (story points)</li>
          <li>Define and uphold "Definition of Done"</li>
        </ul>
        <div class="callout callout-cyan" style="font-size:var(--tiny);">
          <strong>Accountability:</strong> Creating a usable Increment every Sprint that meets the Definition of Done.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"8 Product Owner",html:`
    <div class="section-label">Role Deep Dive</div>
    <div class="slide-title">The <span class="accent">Product Owner</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;align-items:center;gap:20px;padding:24px 28px;background:var(--green-light);border-radius:20px;border:1.5px solid rgba(5,150,105,0.25);">
          <div style="font-size:64px;line-height:1;">🏆</div>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:var(--green-dark);">Product Owner (PO)</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">One person — not a committee — who owns and prioritises the Product Backlog</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Core Responsibilities</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num">1</div><div style="font-size:var(--small);line-height:1.6;">Develop and communicate the <strong>Product Goal</strong> — the long-term objective for the product</div></div>
          <div class="step-item"><div class="step-num">2</div><div style="font-size:var(--small);line-height:1.6;"><strong>Create and refine</strong> Product Backlog items — writing and clarifying user stories</div></div>
          <div class="step-item"><div class="step-num">3</div><div style="font-size:var(--small);line-height:1.6;"><strong>Prioritise</strong> the backlog to maximise value delivered per sprint</div></div>
          <div class="step-item"><div class="step-num">4</div><div style="font-size:var(--small);line-height:1.6;"><strong>Accept or reject</strong> sprint deliverables during Sprint Review</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-green">
          <strong>Key insight:</strong> The PO is the <em>bridge</em> between the business and the development team. Their decisions directly determine the ROI of the product.
        </div>
        <div style="background:white;border-radius:18px;padding:28px;border:1.5px solid rgba(0,0,0,0.08);box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;color:var(--slate);">PO interacts with…</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:12px;font-size:var(--tiny);"><span style="font-size:28px;">🏢</span> <span><strong>Stakeholders &amp; Customers</strong> — gather requirements, priorities</span></div>
            <div style="display:flex;align-items:center;gap:12px;font-size:var(--tiny);"><span style="font-size:28px;">👩‍💻</span> <span><strong>Developers</strong> — clarify stories, answer questions</span></div>
            <div style="display:flex;align-items:center;gap:12px;font-size:var(--tiny);"><span style="font-size:28px;">🛡️</span> <span><strong>Scrum Master</strong> — coaching on best practices</span></div>
          </div>
        </div>
        <div class="callout callout-amber">
          <strong>⚠️ Common mistake:</strong> Having multiple people act as Product Owner. The PO must be <em>one person</em> with final authority over backlog priorities.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"9 Scrum Master",html:`
    <div class="section-label">Role Deep Dive</div>
    <div class="slide-title">The <span class="accent">Scrum Master</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:20px;padding:24px 28px;background:var(--amber-light);border-radius:20px;border:1.5px solid rgba(217,119,6,0.25);">
          <div style="font-size:64px;line-height:1;">🛡️</div>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#78350f;">Scrum Master (SM)</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">A servant-leader who serves the Scrum Team, the Product Owner, and the organisation</div>
          </div>
        </div>
        <div class="three-col" style="gap:14px;flex:0 0 auto;">
          <div style="background:rgba(5,150,105,0.08);border-radius:14px;padding:18px 16px;text-align:center;border:1px solid rgba(5,150,105,0.2);">
            <div style="font-size:32px;">📚</div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-top:8px;">Educator</div>
            <div style="font-size:20px;color:var(--slate);margin-top:4px;line-height:1.4;">Teaches Scrum to everyone</div>
          </div>
          <div style="background:rgba(217,119,6,0.08);border-radius:14px;padding:18px 16px;text-align:center;border:1px solid rgba(217,119,6,0.2);">
            <div style="font-size:32px;">🚧</div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--amber);margin-top:8px;">Remover</div>
            <div style="font-size:20px;color:var(--slate);margin-top:4px;line-height:1.4;">Clears impediments &amp; blockers</div>
          </div>
          <div style="background:rgba(8,145,178,0.08);border-radius:14px;padding:18px 16px;text-align:center;border:1px solid rgba(8,145,178,0.2);">
            <div style="font-size:32px;">🎯</div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--cyan);margin-top:8px;">Facilitator</div>
            <div style="font-size:20px;color:var(--slate);margin-top:4px;line-height:1.4;">Runs all Scrum events</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Serves Three Groups</div>
        <div style="background:var(--green-light);border-radius:16px;padding:20px 24px;border:1px solid rgba(5,150,105,0.2);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:8px;">🏆 Serving the Product Owner</div>
          <ul class="check" style="gap:6px;"><li style="font-size:var(--tiny);">Help manage &amp; refine the Product Backlog</li><li style="font-size:var(--tiny);">Facilitate stakeholder collaboration</li><li style="font-size:var(--tiny);">Ensure PO knows how to maximise value</li></ul>
        </div>
        <div style="background:var(--cyan-light);border-radius:16px;padding:20px 24px;border:1px solid rgba(8,145,178,0.2);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--cyan);margin-bottom:8px;">👩‍💻 Serving the Developers</div>
          <ul class="check" style="gap:6px;"><li style="font-size:var(--tiny);">Coach self-management &amp; cross-functionality</li><li style="font-size:var(--tiny);">Remove external impediments</li><li style="font-size:var(--tiny);">Protect from interruptions &amp; distractions</li></ul>
        </div>
        <div style="background:var(--amber-light);border-radius:16px;padding:20px 24px;border:1px solid rgba(217,119,6,0.2);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--amber);margin-bottom:8px;">🏢 Serving the Organisation</div>
          <ul class="check" style="gap:6px;"><li style="font-size:var(--tiny);">Lead, train &amp; coach Scrum adoption</li><li style="font-size:var(--tiny);">Plan and advise on Scrum implementations</li><li style="font-size:var(--tiny);">Help employees understand empirical thinking</li></ul>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"10 Developers (Dev Team)",html:`
    <div class="section-label">Role Deep Dive</div>
    <div class="slide-title">The <span class="accent">Developers</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;align-items:center;gap:20px;padding:24px 28px;background:var(--cyan-light);border-radius:20px;border:1.5px solid rgba(8,145,178,0.25);">
          <div style="font-size:64px;line-height:1;">👩‍💻</div>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#0e4f5c;">Developers</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">The people who create the product — 3 to 9 members, cross-functional by design</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Team Characteristics</div>
        <ul class="check" style="gap:14px;">
          <li style="font-size:var(--body);"><strong>Cross-functional</strong> — collectively have all skills to create value</li>
          <li style="font-size:var(--body);"><strong>Self-organising</strong> — team decides how to do the work</li>
          <li style="font-size:var(--body);"><strong>Accountable as a team</strong> — no sub-teams or hierarchies within</li>
          <li style="font-size:var(--body);"><strong>Committed</strong> — to the Sprint Goal each iteration</li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-cyan">
          <strong>Definition of Done (DoD):</strong> Developers create and enforce a shared agreement on what "done" means. No increment is released without meeting the DoD.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Typical Roles Within</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">💻</span><span><strong>Software Engineers</strong> — build features, APIs, databases</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">🎨</span><span><strong>UI/UX Designers</strong> — design user interface &amp; experience</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">🧪</span><span><strong>QA Engineers</strong> — test, validate, and ensure quality</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">☁️</span><span><strong>DevOps / Infrastructure</strong> — deployments, CI/CD pipelines</span>
          </div>
        </div>
        <div class="callout callout-amber" style="margin-top:4px;">
          <strong>Ideal team size:</strong> 3–9 people. Too small = lacks skills. Too large = communication overhead explodes.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"11 Scrum Artifacts",html:`
    <div class="deco-circle" style="width:500px;height:500px;background:radial-gradient(circle,rgba(52,211,153,0.1) 0%,transparent 70%);right:-60px;bottom:-80px;"></div>
    <div class="section-label">Artifacts · What We Track</div>
    <div class="slide-title">Three <span class="accent">Scrum Artifacts</span></div>
    <div class="three-col">
      <div class="artifact-card" style="background:rgba(52,211,153,0.12);border:1.5px solid rgba(52,211,153,0.35);">
        <div class="artifact-icon">📋</div>
        <div class="artifact-title" style="color:#34d399;">Product Backlog</div>
        <div class="artifact-def">The single, ordered list of everything that might be needed in the product. The Product Owner manages and prioritises it.</div>
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-bottom:6px;">Commitment →</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.7);background:rgba(52,211,153,0.15);border-radius:8px;padding:10px 14px;">🎯 <strong>Product Goal</strong> — the long-term objective for the Scrum Team</div>
        </div>
      </div>
      <div class="artifact-card" style="background:rgba(251,191,36,0.12);border:1.5px solid rgba(251,191,36,0.35);">
        <div class="artifact-icon">📝</div>
        <div class="artifact-title" style="color:#fbbf24;">Sprint Backlog</div>
        <div class="artifact-def">The Sprint Goal, the Product Backlog items selected for the Sprint, plus the plan for delivering the Increment. Updated daily by Developers.</div>
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:var(--tiny);font-weight:700;color:#fbbf24;margin-bottom:6px;">Commitment →</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.7);background:rgba(251,191,36,0.15);border-radius:8px;padding:10px 14px;">⚡ <strong>Sprint Goal</strong> — the single objective for the Sprint</div>
        </div>
      </div>
      <div class="artifact-card" style="background:rgba(167,139,250,0.12);border:1.5px solid rgba(167,139,250,0.35);">
        <div class="artifact-icon">🚀</div>
        <div class="artifact-title" style="color:#a78bfa;">Increment</div>
        <div class="artifact-def">A concrete stepping stone toward the Product Goal. Must be usable, meeting the Definition of Done. Multiple increments may exist in a single Sprint.</div>
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:var(--tiny);font-weight:700;color:#a78bfa;margin-bottom:6px;">Commitment →</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.7);background:rgba(167,139,250,0.15);border-radius:8px;padding:10px 14px;">✅ <strong>Definition of Done</strong> — quality standard for every increment</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"12 Product Backlog",html:`
    <div class="section-label">Artifact 1</div>
    <div class="slide-title">The <span class="accent">Product Backlog</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-green">
          An <strong>ordered list of everything</strong> that needs to be done to improve the product. It is the single source of work for the Scrum Team. Never complete — always evolving.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Example Product Backlog</div>
        <table class="tbl-green">
          <thead><tr><th>#</th><th>User Story / Feature</th><th>Priority</th><th>Points</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:600;">1</td><td>User can register with email &amp; password</td><td><span class="badge badge-red" style="font-size:18px;padding:3px 12px;">Critical</span></td><td>5</td></tr>
            <tr><td style="font-weight:600;">2</td><td>User can log in and see their dashboard</td><td><span class="badge badge-red" style="font-size:18px;padding:3px 12px;">Critical</span></td><td>8</td></tr>
            <tr><td style="font-weight:600;">3</td><td>User can upload a profile photo</td><td><span class="badge badge-amber" style="font-size:18px;padding:3px 12px;">High</span></td><td>3</td></tr>
            <tr><td style="font-weight:600;">4</td><td>Admin can view all user accounts</td><td><span class="badge badge-amber" style="font-size:18px;padding:3px 12px;">High</span></td><td>5</td></tr>
            <tr><td style="font-weight:600;">5</td><td>System sends email notification on signup</td><td><span class="badge badge-cyan" style="font-size:18px;padding:3px 12px;">Medium</span></td><td>3</td></tr>
          </tbody>
        </table>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Key Properties</div>
        <ul class="check" style="gap:14px;">
          <li style="font-size:var(--body);"><strong>Ordered</strong> by value, risk, and priority</li>
          <li style="font-size:var(--body);"><strong>Refined</strong> continuously (Backlog Refinement)</li>
          <li style="font-size:var(--body);"><strong>Estimated</strong> in story points (relative effort)</li>
          <li style="font-size:var(--body);"><strong>Transparent</strong> — visible to all stakeholders</li>
        </ul>
        <div class="callout callout-amber" style="margin-top:8px;">
          <strong>Backlog Refinement:</strong> The ongoing process of breaking down, detailing, and estimating backlog items. Recommended ~10% of team capacity each sprint.
        </div>
        <div class="callout callout-purple" style="margin-top:4px;">
          <strong>Product Goal:</strong> The long-term commitment embedded in the Product Backlog — it gives the team direction and purpose across multiple sprints.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"13 Sprint Backlog & Increment",html:`
    <div class="section-label">Artifacts 2 &amp; 3</div>
    <div class="slide-title"><span class="accent">Sprint Backlog</span> &amp; Increment</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="padding:24px 28px;background:var(--amber-light);border-radius:18px;border:1.5px solid rgba(217,119,6,0.25);">
          <div style="font-size:36px;margin-bottom:10px;">📝</div>
          <div style="font-size:var(--body);font-weight:700;color:#78350f;">Sprint Backlog</div>
          <div style="font-size:var(--small);color:var(--slate);margin-top:8px;line-height:1.6;">A subset of the Product Backlog selected for the current Sprint, plus the plan for achieving the Sprint Goal. It belongs to the Developers — only they can change it during the Sprint.</div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Sprint Backlog contains</div>
        <ul class="dot" style="gap:10px;">
          <li style="font-size:var(--body);"><strong>Sprint Goal</strong> — the "why" of the sprint</li>
          <li style="font-size:var(--body);"><strong>Selected PBIs</strong> — the user stories / features chosen</li>
          <li style="font-size:var(--body);"><strong>Tasks</strong> — breakdown of work (hours or sub-items)</li>
          <li style="font-size:var(--body);"><strong>Daily plan</strong> — updated each day at Daily Scrum</li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="padding:24px 28px;background:var(--purple-light);border-radius:18px;border:1.5px solid rgba(124,58,237,0.25);">
          <div style="font-size:36px;margin-bottom:10px;">🚀</div>
          <div style="font-size:var(--body);font-weight:700;color:#4c1d95;">Increment</div>
          <div style="font-size:var(--small);color:var(--slate);margin-top:8px;line-height:1.6;">The sum of all completed Product Backlog items in a Sprint plus previous increments. Must be usable and meet the Definition of Done — even if the PO decides not to release it.</div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Definition of Done (DoD)</div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:10px;">✅ Example DoD Checklist</div>
          <ul class="check" style="gap:7px;">
            <li style="font-size:var(--tiny);">All code reviewed by at least one peer</li>
            <li style="font-size:var(--tiny);">Unit tests written and passing (&gt;80% coverage)</li>
            <li style="font-size:var(--tiny);">Feature tested in staging environment</li>
            <li style="font-size:var(--tiny);">Accessibility standards met (WCAG 2.1 AA)</li>
            <li style="font-size:var(--tiny);">Documentation updated (API docs / README)</li>
            <li style="font-size:var(--tiny);">Product Owner has accepted the story</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"14 Scrum Events Overview",html:`
    <div class="deco-circle" style="width:450px;height:450px;background:radial-gradient(circle,rgba(34,211,238,0.1) 0%,transparent 70%);right:-40px;top:-80px;"></div>
    <div class="section-label">Ceremonies · Formal Scrum Events</div>
    <div class="slide-title">Five <span class="accent">Scrum Events</span></div>
    <div style="display:flex;gap:20px;flex:1;align-items:stretch;">

      <div class="event-card" style="background:rgba(52,211,153,0.12);border:1.5px solid rgba(52,211,153,0.35);flex:1;">
        <div class="event-time" style="background:rgba(52,211,153,0.2);color:#34d399;">⚡ 1–4 weeks</div>
        <div class="event-title" style="color:#34d399;">1. The Sprint</div>
        <div class="event-desc">The container for all other events. A fixed-length period where a "Done" usable Increment is created.</div>
      </div>

      <div class="event-card" style="background:rgba(251,191,36,0.12);border:1.5px solid rgba(251,191,36,0.35);flex:1;">
        <div class="event-time" style="background:rgba(251,191,36,0.2);color:#fbbf24;">⏱ max 8 hrs</div>
        <div class="event-title" style="color:#fbbf24;">2. Sprint Planning</div>
        <div class="event-desc">The entire Scrum Team plans the sprint. <em>Why</em> (Sprint Goal), <em>What</em> (PBIs selected), and <em>How</em> (tasks created).</div>
      </div>

      <div class="event-card" style="background:rgba(34,211,238,0.12);border:1.5px solid rgba(34,211,238,0.35);flex:1;">
        <div class="event-time" style="background:rgba(34,211,238,0.2);color:#22d3ee;">⏱ 15 min/day</div>
        <div class="event-title" style="color:#22d3ee;">3. Daily Scrum</div>
        <div class="event-desc">Daily 15-minute standup for Developers to inspect progress toward the Sprint Goal and adapt the Sprint Backlog.</div>
      </div>

      <div class="event-card" style="background:rgba(167,139,250,0.12);border:1.5px solid rgba(167,139,250,0.35);flex:1;">
        <div class="event-time" style="background:rgba(167,139,250,0.2);color:#a78bfa;">⏱ max 4 hrs</div>
        <div class="event-title" style="color:#a78bfa;">4. Sprint Review</div>
        <div class="event-desc">The team presents the Increment to stakeholders. Feedback is collected and the Product Backlog may be adjusted.</div>
      </div>

      <div class="event-card" style="background:rgba(244,114,182,0.12);border:1.5px solid rgba(244,114,182,0.35);flex:1;">
        <div class="event-time" style="background:rgba(244,114,182,0.2);color:#f472b6;">⏱ max 3 hrs</div>
        <div class="event-title" style="color:#f472b6;">5. Sprint Retrospective</div>
        <div class="event-desc">The Scrum Team inspects <em>how they worked</em>: individuals, interactions, processes, tools, and the DoD.</div>
      </div>

    </div>
    <div style="margin-top:18px;font-size:var(--tiny);color:rgba(255,255,255,0.45);text-align:center;">
      All timeboxes shown are for a 4-week Sprint. Scale proportionally for shorter sprints (e.g. 2-week Sprint → Sprint Planning max 4 hours).
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"15 The Sprint",html:`
    <div class="section-label">Event 1</div>
    <div class="slide-title">The <span class="accent">Sprint</span> — Heartbeat of Scrum</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-green">
          The Sprint is a <strong>fixed-length event</strong> of one month or less. A new Sprint starts <em>immediately</em> after the conclusion of the previous one — no gaps.
        </div>
        <ul class="check" style="gap:14px;">
          <li style="font-size:var(--body);">Duration: <strong>1 to 4 weeks</strong> (consistent length)</li>
          <li style="font-size:var(--body);">Contains all Scrum events (Planning → Review → Retro)</li>
          <li style="font-size:var(--body);">No changes endangering the Sprint Goal</li>
          <li style="font-size:var(--body);">Scope may be clarified/renegotiated with PO</li>
          <li style="font-size:var(--body);">Can be <strong>cancelled</strong> by PO if Goal becomes obsolete</li>
        </ul>
        <div class="callout callout-amber">
          <strong>Why short sprints?</strong> Frequent checkpoints reduce risk. If you're heading the wrong direction, you find out in 1–2 weeks, not 6 months.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Sprint Timeline (2-week example)</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--amber-light);border-radius:14px;border:1px solid rgba(217,119,6,0.2);">
            <div style="font-size:32px;">🗓️</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:#78350f;">Day 1 – Sprint Planning</div><div style="font-size:var(--tiny);color:var(--slate);">Set Sprint Goal, select PBIs, plan tasks (max 4 hrs)</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(217,119,6,0.2);color:var(--amber);padding:4px 12px;border-radius:99px;">Day 1</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--cyan-light);border-radius:14px;border:1px solid rgba(8,145,178,0.2);">
            <div style="font-size:32px;">🌅</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:#0e4f5c;">Days 2–9 – Development + Daily Scrums</div><div style="font-size:var(--tiny);color:var(--slate);">Build, test, integrate — 15 min standup each morning</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(8,145,178,0.2);color:var(--cyan);padding:4px 12px;border-radius:99px;">Day 2–9</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--purple-light);border-radius:14px;border:1px solid rgba(124,58,237,0.2);">
            <div style="font-size:32px;">🎯</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:#4c1d95;">Day 10 – Sprint Review</div><div style="font-size:var(--tiny);color:var(--slate);">Demo increment to stakeholders, gather feedback (max 2 hrs)</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(124,58,237,0.2);color:var(--purple);padding:4px 12px;border-radius:99px;">Day 10</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--green-light);border-radius:14px;border:1px solid rgba(5,150,105,0.2);">
            <div style="font-size:32px;">💡</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:var(--green-dark);">Day 10 – Sprint Retrospective</div><div style="font-size:var(--tiny);color:var(--slate);">Team improves process — what worked, what didn't (max 1.5 hrs)</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(5,150,105,0.2);color:var(--green);padding:4px 12px;border-radius:99px;">Day 10</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"16 Sprint Planning",html:`
    <div class="section-label">Event 2</div>
    <div class="slide-title"><span class="accent">Sprint Planning</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:14px;padding:18px 22px;background:var(--amber-light);border-radius:16px;border:1.5px solid rgba(217,119,6,0.25);">
          <span style="font-size:40px;">🗓️</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#78350f;">Sprint Planning</div>
            <div style="font-size:var(--small);color:var(--slate);">Attended by the entire Scrum Team — timeboxed to max 8 hours for a 4-week Sprint</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Three Topics Addressed</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:var(--green-light);border-radius:16px;padding:20px 22px;border:1px solid rgba(5,150,105,0.2);">
            <div style="font-size:var(--small);font-weight:700;color:var(--green);margin-bottom:6px;">Topic 1 — WHY is this Sprint valuable?</div>
            <div style="font-size:var(--tiny);color:var(--slate);line-height:1.5;">The PO proposes how the Sprint can increase value. The team collaboratively defines the <strong>Sprint Goal</strong>.</div>
          </div>
          <div style="background:var(--cyan-light);border-radius:16px;padding:20px 22px;border:1px solid rgba(8,145,178,0.2);">
            <div style="font-size:var(--small);font-weight:700;color:var(--cyan);margin-bottom:6px;">Topic 2 — WHAT can be Done this Sprint?</div>
            <div style="font-size:var(--tiny);color:var(--slate);line-height:1.5;">Developers select Product Backlog items they are confident completing this Sprint. Only they can judge their capacity.</div>
          </div>
          <div style="background:var(--purple-light);border-radius:16px;padding:20px 22px;border:1px solid rgba(124,58,237,0.2);">
            <div style="font-size:var(--small);font-weight:700;color:var(--purple);margin-bottom:6px;">Topic 3 — HOW will the work get done?</div>
            <div style="font-size:var(--tiny);color:var(--slate);line-height:1.5;">Developers decompose selected items into tasks (often under 1 day each). This creates the Sprint Backlog.</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-green">
          <strong>Output:</strong> A Sprint Backlog containing the Sprint Goal, selected PBIs, and a plan (tasks) for delivering the Increment.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Story Point Estimation</div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div style="font-size:var(--tiny);color:var(--slate);line-height:1.65;margin-bottom:14px;">Teams use <strong>story points</strong> (Fibonacci: 1,2,3,5,8,13,21…) to estimate effort. Points are relative — "8" means roughly 8 times harder than a "1".</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <div style="background:var(--green-light);border-radius:10px;padding:10px 16px;text-align:center;">
              <div style="font-size:var(--body);font-weight:700;color:var(--green);">1–3</div>
              <div style="font-size:20px;color:var(--slate);">Small</div>
            </div>
            <div style="background:var(--amber-light);border-radius:10px;padding:10px 16px;text-align:center;">
              <div style="font-size:var(--body);font-weight:700;color:var(--amber);">5–8</div>
              <div style="font-size:20px;color:var(--slate);">Medium</div>
            </div>
            <div style="background:var(--red-light);border-radius:10px;padding:10px 16px;text-align:center;">
              <div style="font-size:var(--body);font-weight:700;color:var(--red);">13+</div>
              <div style="font-size:20px;color:var(--slate);">Large → Split!</div>
            </div>
          </div>
        </div>
        <div class="callout callout-amber">
          <strong>Velocity:</strong> The total story points completed in a Sprint. Used to forecast future sprint capacity (e.g. "our average velocity is 32 points per sprint").
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"17 Daily Scrum (Standup)",html:`
    <div class="section-label">Event 3</div>
    <div class="slide-title">The <span class="accent">Daily Scrum</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--cyan-light);border-radius:18px;border:1.5px solid rgba(8,145,178,0.25);">
          <span style="font-size:48px;">🌅</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#0e4f5c;">Daily Scrum (Standup)</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;"><strong>15 minutes · Every day · Same time &amp; place</strong> · For Developers only</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Purpose</div>
        <div class="callout callout-cyan">
          Inspect progress toward the <strong>Sprint Goal</strong> and adapt the Sprint Backlog as necessary — adjusting the upcoming planned work.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Three Classic Questions</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 20px;background:white;border-radius:14px;border:1.5px solid rgba(5,150,105,0.2);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;">1</div>
            <div style="font-size:var(--small);padding-top:4px;line-height:1.5;"><strong>What did I do yesterday</strong> that helped the team meet the Sprint Goal?</div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 20px;background:white;border-radius:14px;border:1.5px solid rgba(8,145,178,0.2);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--cyan);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;">2</div>
            <div style="font-size:var(--small);padding-top:4px;line-height:1.5;"><strong>What will I do today</strong> to help the team meet the Sprint Goal?</div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 20px;background:white;border-radius:14px;border:1.5px solid rgba(220,38,38,0.2);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--red);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;">3</div>
            <div style="font-size:var(--small);padding-top:4px;line-height:1.5;"><strong>Is there any impediment</strong> blocking me or the team from reaching the Sprint Goal?</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Key Rules</div>
        <ul class="check" style="gap:12px;">
          <li style="font-size:var(--body);">Strictly <strong>15 minutes</strong> — stand up to keep it short</li>
          <li style="font-size:var(--body);"><strong>Developers only</strong> — Scrum Master attends if needed, PO optional</li>
          <li style="font-size:var(--body);">Same time, same place every day for predictability</li>
          <li style="font-size:var(--body);">Not a status report to management — for the team</li>
          <li style="font-size:var(--body);">Impediments are noted; solved in <em>offline</em> conversation</li>
        </ul>
        <div class="callout callout-amber" style="margin-top:8px;">
          <strong>⚠️ Anti-pattern:</strong> Turning the Daily Scrum into a problem-solving session. Raise the issue, agree to discuss it after — keep the standup moving.
        </div>
        <div class="callout callout-green" style="margin-top:4px;">
          <strong>Impact:</strong> Eliminates the need for other meetings. Keeps the team aligned, surfaces blockers early, and creates team ownership of the Sprint Goal.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"18 Sprint Review",html:`
    <div class="section-label">Event 4</div>
    <div class="slide-title"><span class="accent">Sprint Review</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--purple-light);border-radius:18px;border:1.5px solid rgba(124,58,237,0.25);">
          <span style="font-size:48px;">🎯</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#4c1d95;">Sprint Review</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">End of Sprint · Max 4 hours · Entire Scrum Team + Stakeholders</div>
          </div>
        </div>
        <div class="callout callout-purple">
          The Scrum Team presents the results of their work to stakeholders and discusses <strong>progress toward the Product Goal</strong>. The Product Backlog may be adjusted based on feedback.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">What Happens</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num" style="background:var(--purple);">1</div><div style="font-size:var(--small);line-height:1.6;">PO explains what was planned and what was completed</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--purple);">2</div><div style="font-size:var(--small);line-height:1.6;">Developers <strong>demo</strong> the working increment — live demonstration</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--purple);">3</div><div style="font-size:var(--small);line-height:1.6;">Stakeholders provide <strong>feedback</strong> — new ideas, adjustments</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--purple);">4</div><div style="font-size:var(--small);line-height:1.6;">PO updates the <strong>Product Backlog</strong> based on discussion</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Who Attends</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);">
            <span style="font-size:28px;">🏆</span><span style="font-size:var(--small);">Product Owner — presents &amp; accepts work</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);">
            <span style="font-size:28px;">👩‍💻</span><span style="font-size:var(--small);">Developers — demo the increment live</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);">
            <span style="font-size:28px;">🛡️</span><span style="font-size:var(--small);">Scrum Master — facilitates the event</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--purple-light);border-radius:12px;border:1px solid rgba(124,58,237,0.2);">
            <span style="font-size:28px;">🏢</span><span style="font-size:var(--small);"><strong>Stakeholders</strong> — customers, managers, end users</span>
          </div>
        </div>
        <div class="callout callout-amber" style="margin-top:4px;">
          <strong>Key difference:</strong> Sprint Review is NOT a sign-off meeting. It's a collaborative working session for inspecting the increment and adapting the backlog.
        </div>
        <div class="callout callout-green">
          <strong>Output:</strong> A revised Product Backlog that defines probable items for next Sprint based on feedback received.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"19 Sprint Retrospective",html:`
    <div class="section-label">Event 5</div>
    <div class="slide-title"><span class="accent">Sprint Retrospective</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--green-light);border-radius:18px;border:1.5px solid rgba(5,150,105,0.25);">
          <span style="font-size:48px;">💡</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:var(--green-dark);">Sprint Retrospective</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">End of Sprint · Max 3 hours · Scrum Team only (no external stakeholders)</div>
          </div>
        </div>
        <div class="callout callout-green">
          The team inspects <em>how they worked</em> — not what they built. The goal is to identify <strong>improvements</strong> to quality and effectiveness for the next Sprint.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Three Classic Questions</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;background:var(--green-light);border-radius:14px;border:1px solid rgba(5,150,105,0.2);">
            <span style="font-size:32px;">😊</span>
            <div style="font-size:var(--small);line-height:1.5;"><strong>What went well</strong> this Sprint? (Keep doing these)</div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;background:var(--red-light);border-radius:14px;border:1px solid rgba(220,38,38,0.2);">
            <span style="font-size:32px;">😔</span>
            <div style="font-size:var(--small);line-height:1.5;"><strong>What did not go well?</strong> (Stop doing or change)</div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;background:var(--amber-light);border-radius:14px;border:1px solid rgba(217,119,6,0.2);">
            <span style="font-size:32px;">🚀</span>
            <div style="font-size:var(--small);line-height:1.5;"><strong>What improvements</strong> will we commit to next Sprint?</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">What is Inspected</div>
        <ul class="check" style="gap:12px;">
          <li style="font-size:var(--body);"><strong>Individuals</strong> — team dynamics, communication</li>
          <li style="font-size:var(--body);"><strong>Interactions</strong> — how the team collaborates</li>
          <li style="font-size:var(--body);"><strong>Processes</strong> — workflow, ceremonies, practices</li>
          <li style="font-size:var(--body);"><strong>Tools</strong> — Jira, Confluence, CI/CD pipelines</li>
          <li style="font-size:var(--body);"><strong>Definition of Done</strong> — is it still appropriate?</li>
        </ul>
        <div class="callout callout-cyan" style="margin-top:4px;">
          <strong>Output:</strong> The most impactful improvement items are added to the Sprint Backlog for the next Sprint — so improvements happen immediately.
        </div>
        <div class="callout callout-amber">
          <strong>Safe space:</strong> What's said in the Retro stays in the Retro. Psychological safety is essential for honest, productive retrospectives.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"20 User Stories",html:`
    <div class="section-label">Backlog Items</div>
    <div class="slide-title"><span class="accent">User Stories</span> &amp; Acceptance Criteria</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-green">
          A <strong>User Story</strong> is a short, plain-language description of a feature from the perspective of the end user. It captures <em>who</em> wants something, <em>what</em> they want, and <em>why</em>.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Standard Format</div>
        <div style="background:white;border-radius:18px;padding:28px 32px;border:2px solid var(--green);">
          <div style="font-size:var(--body);font-family:'DM Mono',monospace;line-height:2;">
            <span style="color:var(--green);font-weight:700;">As a</span> &nbsp;<span style="background:var(--green-light);padding:2px 12px;border-radius:6px;">[type of user]</span><br/>
            <span style="color:var(--cyan);font-weight:700;">I want</span> &nbsp;<span style="background:var(--cyan-light);padding:2px 12px;border-radius:6px;">[to perform some action]</span><br/>
            <span style="color:var(--amber);font-weight:700;">So that</span> <span style="background:var(--amber-light);padding:2px 12px;border-radius:6px;">[I can achieve some goal]</span>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Example Stories</div>
        <div style="background:white;border-radius:14px;padding:18px 22px;border:1px solid rgba(5,150,105,0.2);font-size:var(--tiny);line-height:1.7;">
          🟢 <strong>As a</strong> student, <strong>I want</strong> to view my attendance record, <strong>so that</strong> I know if I am at risk of failing due to absences.
        </div>
        <div style="background:white;border-radius:14px;padding:18px 22px;border:1px solid rgba(8,145,178,0.2);font-size:var(--tiny);line-height:1.7;">
          🔵 <strong>As a</strong> lecturer, <strong>I want</strong> to export attendance to CSV, <strong>so that</strong> I can share it with administration quickly.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Acceptance Criteria</div>
        <div class="callout callout-cyan">
          <strong>Acceptance Criteria</strong> define the specific conditions a story must meet to be considered Done. Written by the Product Owner — verified by the team.
        </div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--cyan);margin-bottom:10px;">Example AC for "view attendance record":</div>
          <ul class="check" style="gap:7px;">
            <li style="font-size:var(--tiny);">Student can see attendance % per subject</li>
            <li style="font-size:var(--tiny);">Dates of absences shown chronologically</li>
            <li style="font-size:var(--tiny);">A warning appears if attendance &lt; 80%</li>
            <li style="font-size:var(--tiny);">Page loads in under 2 seconds</li>
            <li style="font-size:var(--tiny);">Works on mobile and desktop browsers</li>
          </ul>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">INVEST Criteria for Good Stories</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <span class="badge badge-green">I — Independent</span>
          <span class="badge badge-cyan">N — Negotiable</span>
          <span class="badge badge-amber">V — Valuable</span>
          <span class="badge badge-purple">E — Estimable</span>
          <span class="badge badge-red">S — Small</span>
          <span class="badge" style="background:#0d9488;color:#fff;">T — Testable</span>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"21 Scrum Board (Kanban)",html:`
    <div class="section-label">Visual Management</div>
    <div class="slide-title">The <span class="accent">Scrum Board</span></div>
    <div style="margin-bottom:14px;font-size:var(--small);color:var(--slate);">A physical or digital board (e.g. Jira, Trello) tracking Sprint Backlog items across workflow stages. Updated daily at the Daily Scrum.</div>
    <div class="four-col" style="flex:1;">
      <div class="kanban-col" style="background:rgba(100,116,139,0.07);border:1.5px solid rgba(100,116,139,0.2);">
        <div class="kanban-header" style="color:var(--slate);border-bottom:3px solid var(--slate);">📋 TO DO</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">User login page</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">Password reset flow</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">Email notifications</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">Profile photo upload</div>
      </div>
      <div class="kanban-col" style="background:rgba(217,119,6,0.06);border:1.5px solid rgba(217,119,6,0.25);">
        <div class="kanban-header" style="color:var(--amber);border-bottom:3px solid var(--amber);">⚙️ IN PROGRESS</div>
        <div class="kanban-card" style="border-left-color:var(--amber);">User registration form<div style="margin-top:6px;font-size:18px;color:var(--amber);">👤 Sarah</div></div>
        <div class="kanban-card" style="border-left-color:var(--amber);">Dashboard UI layout<div style="margin-top:6px;font-size:18px;color:var(--amber);">👤 James</div></div>
      </div>
      <div class="kanban-col" style="background:rgba(8,145,178,0.06);border:1.5px solid rgba(8,145,178,0.25);">
        <div class="kanban-header" style="color:var(--cyan);border-bottom:3px solid var(--cyan);">🔍 IN REVIEW / QA</div>
        <div class="kanban-card" style="border-left-color:var(--cyan);">API authentication endpoint<div style="margin-top:6px;font-size:18px;color:var(--cyan);">👤 Priya reviewing</div></div>
        <div class="kanban-card" style="border-left-color:var(--cyan);">Database schema migration<div style="margin-top:6px;font-size:18px;color:var(--cyan);">👤 Mark reviewing</div></div>
      </div>
      <div class="kanban-col" style="background:rgba(5,150,105,0.06);border:1.5px solid rgba(5,150,105,0.25);">
        <div class="kanban-header" style="color:var(--green);border-bottom:3px solid var(--green);">✅ DONE</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Project scaffolding &amp; CI setup</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Database design &amp; ERD</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Tech stack decision</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Sprint 0 planning complete</div>
      </div>
    </div>
    <div style="margin-top:14px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
      <div style="font-size:var(--tiny);color:var(--slate);">Popular tools:</div>
      <span class="badge" style="background:#0052cc;color:#fff;">Jira</span>
      <span class="badge" style="background:#0079bf;color:#fff;">Trello</span>
      <span class="badge" style="background:#6366f1;color:#fff;">Linear</span>
      <span class="badge" style="background:#333;color:#fff;">GitHub Projects</span>
      <span class="badge" style="background:#059669;color:#fff;">Azure DevOps</span>
      <div style="font-size:var(--tiny);color:var(--slate);margin-left:8px;">Or a physical whiteboard with sticky notes!</div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark-green",label:"22 Scrum in IT Industry",html:`
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(52,211,153,0.12) 0%,transparent 70%);right:-80px;top:-100px;"></div>
    <div class="section-label">Real World · IT Industry</div>
    <div class="slide-title">Scrum in the <span class="accent">IT Industry</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:#34d399;letter-spacing:0.08em;text-transform:uppercase;">Where Scrum is Used</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🌐</span><span style="font-size:var(--small);"><strong>Web &amp; Mobile App Development</strong> — React, iOS, Android products</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">☁️</span><span style="font-size:var(--small);"><strong>Cloud &amp; SaaS Platforms</strong> — AWS, Azure product teams</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🤖</span><span style="font-size:var(--small);"><strong>AI / Data Science Projects</strong> — model development cycles</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🔒</span><span style="font-size:var(--small);"><strong>Cybersecurity &amp; Networking</strong> — vulnerability management</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🏦</span><span style="font-size:var(--small);"><strong>Enterprise IT</strong> — SAP, ERP, CRM implementations</span>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:#34d399;letter-spacing:0.08em;text-transform:uppercase;">Business Benefits</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">⚡</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-top:8px;">Faster Delivery</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Value shipped every 1-4 weeks</div>
          </div>
          <div style="background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">🎯</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#fbbf24;margin-top:8px;">Lower Risk</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Problems caught early &amp; often</div>
          </div>
          <div style="background:rgba(34,211,238,0.12);border:1px solid rgba(34,211,238,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">🤝</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#22d3ee;margin-top:8px;">Better Collaboration</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Daily communication &amp; alignment</div>
          </div>
          <div style="background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">📈</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#a78bfa;margin-top:8px;">Continuous Improvement</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Retrospectives drive growth</div>
          </div>
        </div>
        <div style="text-align:center;margin-top:8px;padding:16px 20px;background:rgba(52,211,153,0.1);border-radius:14px;border:1px solid rgba(52,211,153,0.25);">
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);">Industry adoption</div>
          <div style="font-size:var(--body);font-weight:700;color:#34d399;">87% of Agile teams use Scrum</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.45);">Source: 17th State of Agile Report</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`}];function $s(){const[t,r]=a.useState(0),[o,h]=a.useState(!1),[s,w]=a.useState(!1),A=a.useRef(null),N=a.useRef(null),z=st.length;a.useEffect(()=>{const f="scrum-deck-styles";if(!document.getElementById(f)){const g=document.createElement("style");g.id=f,g.textContent=Js,document.head.appendChild(g)}return()=>{const g=document.getElementById(f);g&&g.remove()}},[]),a.useEffect(()=>{const f=A.current,g=N.current;if(!f||!g)return;const d=new ResizeObserver(()=>{const{width:l}=f.getBoundingClientRect(),c=l/1920;g.style.transform=`scale(${c})`,g.style.transformOrigin="top left",f.style.height=`${1080*c}px`});return d.observe(f),()=>d.disconnect()},[]),a.useEffect(()=>{const f=g=>{(g.key==="ArrowRight"||g.key==="ArrowDown")&&r(d=>Math.min(d+1,z-1)),(g.key==="ArrowLeft"||g.key==="ArrowUp")&&r(d=>Math.max(d-1,0)),g.key==="Escape"&&s&&S()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[s,z]),a.useEffect(()=>{const f=()=>w(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",f),()=>document.removeEventListener("fullscreenchange",f)},[]);function M(){A.current?.requestFullscreen?.()}function S(){document.exitFullscreen?.()}const D=st[t];return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>r(f=>Math.max(f-1,0)),disabled:t===0,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(5,150,105,0.3)"},children:e.jsx(le,{size:18})}),e.jsxs("span",{className:"text-sm font-medium text-gray-600 min-w-[80px] text-center",children:[t+1," / ",z]}),e.jsx("button",{onClick:()=>r(f=>Math.min(f+1,z-1)),disabled:t===z-1,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:"rgba(5,150,105,0.3)"},children:e.jsx(X,{size:18})})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400 hidden sm:block",children:D.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>h(f=>!f),className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(5,150,105,0.3)"},title:o?"Collapse":"Expand",children:o?e.jsx(ie,{size:16}):e.jsx(ae,{size:16})}),e.jsx("button",{onClick:s?S:M,className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:"rgba(5,150,105,0.3)"},title:s?"Exit fullscreen":"Fullscreen",children:s?e.jsx(oe,{size:16}):e.jsx(re,{size:16})})]})]}),e.jsx("div",{ref:A,className:"scrum relative w-full overflow-hidden rounded-xl",style:{border:"1px solid rgba(5,150,105,0.3)"},children:e.jsx("div",{ref:N,style:{width:1920,height:1080},children:e.jsx("section",{className:D.classes,style:D.bg?{background:D.bg}:void 0,dangerouslySetInnerHTML:{__html:D.html}})})}),e.jsx("div",{className:`flex flex-wrap justify-center gap-1.5 ${o?"mt-2":""}`,children:st.map((f,g)=>e.jsx("button",{onClick:()=>r(g),title:f.label,className:"rounded-full transition-all",style:{width:g===t?24:8,height:8,background:g===t?"#059669":"rgba(5,150,105,0.25)"}},g))})]})}const dt="agileScrumMcqResults",Ot="Agile Scrum Process – Knowledge Check",Z=50,ke=90,de=3,ve=["Agile Foundations","Scrum Framework & Pillars","Scrum Roles","Scrum Artifacts","Scrum Events & Ceremonies"],ue=[{id:"as01",category:"Agile Foundations",question:"In what year was the Agile Manifesto written?",choices:["1995","1999","2001","2005"],correct:2},{id:"as02",category:"Agile Foundations",question:"Which of the following is one of the four core values stated in the Agile Manifesto?",choices:["Comprehensive documentation over working software","Individuals and interactions over processes and tools","Contract negotiation over customer collaboration","Following a plan over responding to change"],correct:1},{id:"as03",category:"Agile Foundations",question:"According to the Agile Manifesto, what is valued MORE than comprehensive documentation?",choices:["Working software","Customer collaboration","Responding to change","Individuals and interactions"],correct:0},{id:"as04",category:"Agile Foundations",question:"Which approach typically delivers all project output in a single release at the very end of the project?",choices:["Agile","Scrum","Waterfall","Kanban"],correct:2},{id:"as05",category:"Agile Foundations",question:"Compared to Waterfall, when does testing occur in an Agile project?",choices:["Only after all development is complete","Only at the start of the project","Continuously throughout every iteration or sprint","Only during the final user-acceptance phase"],correct:2},{id:"as06",category:"Agile Foundations",question:'What does "iterative development" mean in the context of Agile?',choices:["Writing code and then rewriting it from scratch every few months","Delivering work in small cycles with feedback gathered at each stage","Repeating the same fixed plan until the product is complete","Assigning different developers to the same task in rotation"],correct:1},{id:"as07",category:"Scrum Framework & Pillars",question:"What are the three empirical pillars of Scrum?",choices:["Planning, Execution, Delivery","Transparency, Inspection, Adaptation","Roles, Artifacts, Events","Backlog, Sprint, Increment"],correct:1},{id:"as08",category:"Scrum Framework & Pillars",question:"What is the recommended duration of a Scrum Sprint?",choices:["1 day to 1 week","1 to 4 weeks","1 to 3 months","3 to 6 months"],correct:1},{id:"as09",category:"Scrum Framework & Pillars",question:"Which Scrum pillar ensures that all significant aspects of the process are visible to everyone responsible for the outcome?",choices:["Adaptation","Inspection","Transparency","Collaboration"],correct:2},{id:"as10",category:"Scrum Framework & Pillars",question:"The Scrum Guide defines Scrum as which of the following?",choices:["A full software development methodology with prescriptive coding standards","A lightweight framework for developing, delivering, and sustaining complex products","A project management tool specifically designed for IT infrastructure projects","A waterfall-based approach that incorporates periodic reviews"],correct:1},{id:"as11",category:"Scrum Framework & Pillars",question:"What is the recommended number of Developers (excluding Scrum Master and Product Owner) in a Scrum Team?",choices:["1–2","3–9","10–15","Any number"],correct:1},{id:"as12",category:"Scrum Framework & Pillars",question:'What does the "Adaptation" pillar of Scrum require?',choices:["That the team adapts to each developer's personal work style","That requirements are adapted at the end of each project phase","That the process is adjusted as soon as possible when inspection reveals deviation beyond acceptable limits","That the Scrum Master adapts the framework to suit the organisation's existing processes"],correct:2},{id:"as13",category:"Scrum Roles",question:"How many distinct roles exist within a Scrum Team?",choices:["2","3","4","5"],correct:1},{id:"as14",category:"Scrum Roles",question:"Who is accountable for maximising the value of the product resulting from the Scrum Team's work?",choices:["Scrum Master","Development Team Lead","Product Owner","Project Manager"],correct:2},{id:"as15",category:"Scrum Roles",question:"Which statement best describes the primary responsibility of the Scrum Master?",choices:["Writing code and building the product features","Managing and updating the Product Backlog daily","Acting as a servant-leader who ensures Scrum is understood and enacted","Representing customer stakeholders and approving deliverables"],correct:2},{id:"as16",category:"Scrum Roles",question:"According to Scrum, how many Product Owners should a single Scrum Team have?",choices:["One per developer on the team","One","One per major stakeholder group","Two — one for business and one for technical concerns"],correct:1},{id:"as17",category:"Scrum Roles",question:"Who is responsible for creating the product Increment during each Sprint?",choices:["Product Owner","Scrum Master","Developers","External QA team"],correct:2},{id:"as18",category:"Scrum Roles",question:'In Scrum, what does it mean for Developers to be a "cross-functional" team?',choices:["Each developer works across multiple Scrum Teams simultaneously","The team collectively has all the skills needed to create a valuable product Increment","Each developer is required to know multiple programming languages","Developers report to multiple managers from different business units"],correct:1},{id:"as19",category:"Scrum Artifacts",question:"What are the three Scrum artifacts?",choices:["Sprint, Review, Retrospective","Product Backlog, Sprint Backlog, Increment","Product Owner, Scrum Master, Developers","User Stories, Tasks, Epics"],correct:1},{id:"as20",category:"Scrum Artifacts",question:"Who is responsible for managing and prioritising the Product Backlog?",choices:["Scrum Master","Developers collectively","Product Owner","Stakeholders by majority vote"],correct:2},{id:"as21",category:"Scrum Artifacts",question:'What is the "Definition of Done" (DoD) in Scrum?',choices:["A list of features planned for development in the next sprint","A formal quality standard that must be met for an Increment to be considered complete","The Product Owner's written acceptance signature on a user story","A contract document describing the full project scope"],correct:1},{id:"as22",category:"Scrum Artifacts",question:"What is the Sprint Goal in relation to the Sprint Backlog?",choices:["A detailed list of every task that must be completed in the sprint","The single objective for the Sprint — the commitment embedded in the Sprint Backlog","The team's velocity target expressed in story points","The Product Owner's overall product vision statement"],correct:1},{id:"as23",category:"Scrum Artifacts",question:"In Scrum, what is the purpose of story point estimation?",choices:["To measure the exact number of hours each task will take","To assign monetary value to each backlog item","To express relative effort and complexity of backlog items, enabling capacity planning","To track individual developer productivity"],correct:2},{id:"as24",category:"Scrum Artifacts",question:"What is the Increment in Scrum?",choices:["The increase in team velocity measured between two consecutive sprints","The sum of all completed Product Backlog items that meet the Definition of Done","The total number of story points added to the backlog during a sprint","The difference between the planned and actual work completed in a sprint"],correct:1},{id:"as25",category:"Scrum Events & Ceremonies",question:"How many formal Scrum events are defined in the Scrum framework?",choices:["3","4","5","6"],correct:2},{id:"as26",category:"Scrum Events & Ceremonies",question:"What is the maximum timebox for Sprint Planning in a 4-week Sprint?",choices:["2 hours","4 hours","8 hours","1 full working day (8+ hours)"],correct:2},{id:"as27",category:"Scrum Events & Ceremonies",question:"Which three topics are addressed during Sprint Planning?",choices:["Who works on what, when tasks are due, and who is responsible for testing","Why is this Sprint valuable, what can be done, and how will the work get done","Scope, budget, and timeline for the Sprint","Product Backlog refinement, testing plan, and release schedule"],correct:1},{id:"as28",category:"Scrum Events & Ceremonies",question:"What is the timebox for the Daily Scrum (standup)?",choices:["5 minutes","15 minutes","30 minutes","1 hour"],correct:1},{id:"as29",category:"Scrum Events & Ceremonies",question:"What is the primary purpose of the Sprint Review?",choices:["To review the team's working processes and identify improvements for the next sprint","To plan which items will be selected for the next sprint","To present the Increment to stakeholders, gather feedback, and adapt the Product Backlog","To assess individual team member performance against KPIs"],correct:2},{id:"as30",category:"Scrum Events & Ceremonies",question:"What is the key difference between the Sprint Review and the Sprint Retrospective?",choices:["The Sprint Review is for the team only; the Retrospective includes external stakeholders","The Sprint Review inspects the product Increment with stakeholders; the Retrospective inspects the team's own processes and ways of working","The Sprint Review is mandatory in Scrum; the Retrospective is optional","The Sprint Review happens at the start of the sprint; the Retrospective happens at the midpoint"],correct:1}],kt=["A","B","C","D"];function Xs({studentProfile:t}){const{user:r}=me(),[o,h]=a.useState("loading"),[s,w]=a.useState({}),[A,N]=a.useState(!1),[z,M]=a.useState(0),[S,D]=a.useState(!1),[f,g]=a.useState([]),[d,l]=a.useState(!1),[c,b]=a.useState(Object.fromEntries(ve.map(y=>[y,!0]))),v=ue.length,E=Object.keys(s).length,R=Math.round(E/v*100),m=f.length,k=f.length>0?Math.max(...f.map(y=>y.percentage)):0;a.useEffect(()=>{r&&(async()=>{try{const y=await Re($(U,dt,r.uid));if(y.exists()){const x=y.data(),j=(x.attempts??[]).map(I=>({...I,completedAt:I.completedAt?.toDate?.()??new Date}));g(j),l(x.badgeEarned??!1),h(j.length>=de?"exhausted":"intro")}else h("intro")}catch{h("intro")}})()},[r]);function n(y,x){w(j=>({...j,[y]:x}))}function i(y){b(x=>({...x,[y]:!x[y]}))}async function u(){if(!r)return;N(!0);const y=ue.filter(L=>s[L.id]===L.correct).length,x=Math.round(y/v*100);M(y);const I=m===0&&x>=ke,T={score:y,total:v,percentage:x,completedAt:new Date},P=[...f,T],F=Math.max(k,x),O=F>Z;try{const L=$(U,dt,r.uid);m===0?await Te(L,{studentUid:r.uid,studentName:t?.fullName??r.email??"Unknown",studentDisplayId:t?.studentId??"",studentSection:t?.section??"",studentCampus:t?.campus??"",attempts:[{score:y,total:v,percentage:x,completedAt:new Date}],bestPercentage:x,badgeEarned:I,passed:O,attemptCount:1,firstAttemptAt:se(),lastAttemptAt:se()}):await He(L,{attempts:jt({score:y,total:v,percentage:x,completedAt:new Date}),bestPercentage:F,passed:O,attemptCount:P.length,lastAttemptAt:se()}),I&&(await Te($(U,"students",r.uid),{agileScrumMcqBadge:!0},{merge:!0}),l(!0))}catch{}g(P),h("result"),N(!1),window.scrollTo({top:0,behavior:"smooth"})}function C(){w({}),M(0),D(!1),b(Object.fromEntries(ve.map(y=>[y,!0]))),h("intro"),window.scrollTo({top:0,behavior:"smooth"})}if(o==="loading")return e.jsx("div",{className:"flex justify-center py-8",children:e.jsx("div",{className:"w-6 h-6 rounded-full border-2 animate-spin",style:{borderColor:"rgba(5,150,105,0.2)",borderTopColor:"#059669"}})});if(o==="exhausted"){const y=f.reduce((j,I)=>I.percentage>j.percentage?I:j,f[0]),x=y.percentage>Z;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-2xl p-5 border text-center",style:{background:x?"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))":"linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))",borderColor:x?"rgba(5,150,105,0.25)":"rgba(239,68,68,0.25)"},children:[d&&e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("span",{className:"inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full",style:{background:"rgba(251,191,36,0.2)",color:"#b45309",border:"1px solid rgba(251,191,36,0.4)"},children:[e.jsx(G,{size:14,className:"fill-amber-500 text-amber-500 stroke-0"})," Agile Scrum Distinction Badge Earned"]})}),e.jsx(he,{size:28,style:{color:x?"#059669":"#dc2626",margin:"0 auto 8px"}}),e.jsxs("p",{className:"text-lg font-bold",style:{color:x?"#065f46":"#991b1b"},children:[de," attempts used"]}),e.jsxs("p",{className:"text-sm mt-1",style:{color:x?"#047857":"#b91c1c"},children:["Best score: ",e.jsxs("strong",{children:[y.percentage,"%"]})," (",y.score,"/",y.total,")"]}),e.jsx("p",{className:"text-xs mt-2",style:{color:"#6b7280"},children:x?"Great work — you have passed this Agile Scrum knowledge check!":`Score above ${Z}% to pass. Review the slide deck and try again next time.`})]}),e.jsx(St,{attempts:f})]})}if(o==="intro"){const y=de-m;return e.jsxs("div",{className:"space-y-4",children:[d&&e.jsxs("div",{className:"rounded-xl px-4 py-3 flex items-center gap-3",style:{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)"},children:[e.jsx(G,{size:16,className:"fill-amber-500 text-amber-500 stroke-0 shrink-0"}),e.jsx("p",{className:"text-xs font-semibold",style:{color:"#b45309"},children:"You earned the Agile Scrum Distinction Badge on your first attempt — well done!"})]}),f.length>0&&e.jsx(St,{attempts:f}),e.jsx("div",{className:"rounded-2xl p-5 border",style:{background:"linear-gradient(135deg, rgba(209,250,229,0.6), rgba(167,243,208,0.35))",borderColor:"rgba(5,150,105,0.25)"},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(V,{size:22,style:{color:"#059669",flexShrink:0,marginTop:2}}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#065f46"},children:Ot}),e.jsxs("p",{className:"text-xs mt-1 leading-5",style:{color:"#047857"},children:[v," multiple-choice questions across ",ve.length," topic areas. Score above ",Z,"% to pass. Score ",ke,"%+ on your ",e.jsx("strong",{children:"first attempt"})," to earn a special badge."]}),e.jsx("div",{className:"flex flex-wrap gap-2 mt-3",children:ve.map(x=>e.jsx("span",{className:"text-xs px-2.5 py-0.5 rounded-full font-medium",style:{background:"rgba(5,150,105,0.15)",color:"#065f46"},children:x},x))}),e.jsxs("div",{className:"flex items-center gap-3 mt-4 flex-wrap",children:[e.jsx("button",{onClick:()=>h("taking"),className:"btn-primary text-sm px-5 py-2",style:{background:"#059669"},children:m===0?"Start Quiz":`Retake (Attempt ${m+1}/${de})`}),e.jsxs("span",{className:"text-xs",style:{color:"#6b7280"},children:[y," attempt",y!==1?"s":""," remaining"]})]})]})]})})]})}if(o==="result"){const y=Math.round(z/v*100),x=y>Z,j=m===1&&y>=ke,I=de-f.length;return e.jsxs("div",{className:"space-y-5",children:[j&&e.jsxs("div",{className:"rounded-2xl px-5 py-4 text-center border",style:{background:"linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",borderColor:"rgba(251,191,36,0.4)"},children:[e.jsx(G,{size:32,className:"fill-amber-500 text-amber-500 stroke-0 mx-auto mb-2"}),e.jsx("p",{className:"text-sm font-bold",style:{color:"#92400e"},children:"Agile Scrum Distinction Badge Earned!"}),e.jsxs("p",{className:"text-xs mt-1",style:{color:"#b45309"},children:["You scored ",y,"% on your first attempt — outstanding! A badge has been added to your profile."]})]}),e.jsxs("div",{className:"rounded-2xl p-6 border text-center",style:{background:x?"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))":"linear-gradient(135deg, rgba(254,226,226,0.9), rgba(254,202,202,0.7))",borderColor:x?"rgba(5,150,105,0.25)":"rgba(239,68,68,0.25)"},children:[e.jsx(Ie,{size:36,style:{color:x?"#059669":"#dc2626",margin:"0 auto 8px"}}),e.jsxs("p",{className:"text-3xl font-extrabold",style:{color:x?"#065f46":"#991b1b"},children:[z," / ",v]}),e.jsxs("p",{className:"text-lg font-semibold mt-1",style:{color:x?"#047857":"#b91c1c"},children:[y,"% — ",x?"Passed!":`Need >${Z}% to pass.`]}),e.jsx("div",{className:"mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-left",children:ve.map(T=>{const P=ue.filter(L=>L.category===T),F=P.filter(L=>s[L.id]===L.correct).length,O=Math.round(F/P.length*100);return e.jsxs("div",{className:"rounded-xl px-3 py-2",style:{background:"rgba(255,255,255,0.55)"},children:[e.jsx("p",{className:"text-xs font-semibold",style:{color:"#374151"},children:T}),e.jsxs("p",{className:"text-sm font-bold mt-0.5",style:{color:"#1e1b4b"},children:[F,"/",P.length," ",e.jsxs("span",{className:"text-xs font-normal",style:{color:"#6b7280"},children:["(",O,"%)"]})]})]},T)})})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap",children:[e.jsxs("button",{onClick:()=>D(T=>!T),className:"btn-secondary text-sm px-4 py-2 flex items-center gap-1.5",children:[S?e.jsx(te,{size:16}):e.jsx(Y,{size:16}),S?"Hide Review":"Review Answers"]}),I>0&&e.jsxs("button",{onClick:C,className:"btn-secondary text-sm px-4 py-2 flex items-center gap-1.5",children:[e.jsx(Pe,{size:16}),"Retake (",I," left)"]})]}),S&&e.jsx("div",{className:"space-y-4",children:ue.map((T,P)=>{const F=s[T.id]??-1,O=F===T.correct;return e.jsx("div",{className:"rounded-2xl p-4 border",style:{background:O?"rgba(209,250,229,0.5)":"rgba(254,226,226,0.5)",borderColor:O?"rgba(5,150,105,0.2)":"rgba(239,68,68,0.2)"},children:e.jsxs("div",{className:"flex items-start gap-2",children:[O?e.jsx(K,{size:18,style:{color:"#059669",flexShrink:0,marginTop:2}}):e.jsx(Le,{size:18,style:{color:"#dc2626",flexShrink:0,marginTop:2}}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wide mb-1",style:{color:"#6b7280"},children:["Q",P+1," · ",T.category]}),e.jsx("p",{className:"text-sm font-medium",style:{color:"#1e1b4b"},children:T.question}),e.jsx("div",{className:"mt-2 space-y-1",children:T.choices.map((L,B)=>{const q=B===F,Fe=B===T.correct;let ye="transparent",pe="#4b5563";return Fe?(ye="rgba(209,250,229,0.8)",pe="#065f46"):q&&!O&&(ye="rgba(254,202,202,0.8)",pe="#991b1b"),e.jsxs("div",{className:"text-xs px-3 py-1.5 rounded-lg flex items-center gap-2",style:{background:ye,color:pe},children:[e.jsxs("span",{className:"font-bold",children:[kt[B],"."]})," ",L,Fe&&e.jsx(K,{size:13,style:{marginLeft:"auto",color:"#059669"}})]},B)})})]})]})},T.id)})})]})}const p=v-E;return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"rounded-2xl p-4 border sticky top-0 z-10",style:{background:"rgba(209,250,229,0.97)",borderColor:"rgba(5,150,105,0.2)",backdropFilter:"blur(8px)"},children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#065f46"},children:[E," of ",v," answered · Attempt ",m+1,"/",de]}),e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#065f46"},children:[R,"%"]})]}),e.jsx("div",{className:"w-full rounded-full h-2",style:{background:"rgba(5,150,105,0.2)"},children:e.jsx("div",{className:"h-2 rounded-full transition-all",style:{width:`${R}%`,background:"linear-gradient(90deg, #34d399, #059669)"}})})]}),ve.map(y=>{const x=ue.filter(T=>T.category===y),j=x.filter(T=>s[T.id]!==void 0).length,I=c[y];return e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(5,150,105,0.18)"},children:[e.jsxs("button",{onClick:()=>i(y),className:"w-full flex items-center justify-between px-4 py-3",style:{background:"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))"},children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-sm font-bold",style:{color:"#065f46"},children:y}),e.jsxs("span",{className:"text-xs px-2 py-0.5 rounded-full font-medium",style:{background:j===x.length?"rgba(5,150,105,0.3)":"rgba(5,150,105,0.12)",color:j===x.length?"#065f46":"#047857"},children:[j,"/",x.length]})]}),I?e.jsx(te,{size:16,style:{color:"#059669"}}):e.jsx(Y,{size:16,style:{color:"#059669"}})]}),I&&e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(5,150,105,0.1)"},children:x.map(T=>{const P=ue.indexOf(T),F=s[T.id]??-1;return e.jsxs("div",{className:"p-4",style:{background:"rgba(255,255,255,0.6)"},children:[e.jsxs("p",{className:"text-xs font-semibold mb-2",style:{color:"#9ca3af"},children:["Question ",P+1]}),e.jsx("p",{className:"text-sm font-medium leading-6",style:{color:"#1e1b4b"},children:T.question}),e.jsx("div",{className:"mt-3 space-y-2",children:T.choices.map((O,L)=>{const B=L===F;return e.jsxs("button",{onClick:()=>n(T.id,L),className:"w-full text-left text-sm rounded-xl px-3 py-2.5 border transition-all flex items-start gap-2",style:{borderColor:B?"#059669":"rgba(5,150,105,0.18)",background:B?"linear-gradient(135deg, rgba(209,250,229,0.95), rgba(167,243,208,0.8))":"rgba(255,255,255,0.5)",color:B?"#065f46":"#374151",fontWeight:B?600:400},children:[e.jsx("span",{className:"flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5",style:{background:B?"#059669":"rgba(5,150,105,0.12)",color:B?"#fff":"#059669"},children:kt[L]}),e.jsx("span",{className:"leading-5",children:O})]},L)})})]},T.id)})})]},y)}),e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(209,250,229,0.95), rgba(167,243,208,0.85))",borderColor:"rgba(5,150,105,0.2)"},children:[p>0&&e.jsxs("p",{className:"text-xs mb-3",style:{color:"#92400e",background:"rgba(254,243,199,0.8)",borderRadius:8,padding:"6px 10px"},children:[p," unanswered question",p>1?"s":""," — these will count as incorrect."]}),e.jsx("button",{onClick:u,disabled:A,className:"w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-opacity disabled:opacity-60",style:{background:"#059669"},children:A?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 rounded-full border-2 animate-spin",style:{borderColor:"#ffffff44",borderTopColor:"#fff"}}),"Submitting…"]}):e.jsxs(e.Fragment,{children:[e.jsx(ct,{size:16})," Submit Quiz"]})})]})]})}function St({attempts:t}){return t.length===0?null:e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(5,150,105,0.15)"},children:[e.jsx("div",{className:"px-4 py-3",style:{background:"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))"},children:e.jsx("p",{className:"text-xs font-bold",style:{color:"#065f46"},children:"Your Previous Attempts"})}),e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(5,150,105,0.08)"},children:t.map((r,o)=>{const h=r.percentage>Z;return e.jsxs("div",{className:"flex items-center justify-between px-4 py-3",style:{background:"rgba(255,255,255,0.6)"},children:[e.jsxs("p",{className:"text-xs font-semibold",style:{color:"#6b7280"},children:["Attempt ",o+1]}),e.jsxs("span",{className:"text-xs font-bold px-2.5 py-1 rounded-full",style:{background:h?"rgba(209,250,229,0.8)":"rgba(254,226,226,0.8)",color:h?"#065f46":"#991b1b"},children:[r.score,"/",r.total," (",r.percentage,"%)"]})]},o)})})]})}function zt(t){return t.toLocaleString("en-NZ",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function ei(){const[t,r]=a.useState([]),[o,h]=a.useState(!0),[s,w]=a.useState("date"),[A,N]=a.useState("desc"),[z,M]=a.useState(""),[S,D]=a.useState(null);a.useEffect(()=>{const i=ft(ze(U,dt),gt("lastAttemptAt","desc")),u=ht(i,C=>{const p=C.docs.map(y=>{const x=y.data();return{studentUid:x.studentUid??y.id,studentName:x.studentName??"Unknown",studentDisplayId:x.studentDisplayId??"",studentSection:x.studentSection??"",studentCampus:x.studentCampus??"",attempts:(x.attempts??[]).map(j=>({...j,completedAt:j.completedAt?.toDate?.()??new Date})),bestPercentage:x.bestPercentage??0,badgeEarned:x.badgeEarned??!1,passed:x.passed??!1,attemptCount:x.attemptCount??0,lastAttemptAt:x.lastAttemptAt?.toDate?.()??new Date}});r(p),h(!1)});return()=>u()},[]);const f=t.length,g=t.filter(i=>i.passed).length,d=t.filter(i=>i.badgeEarned).length,l=f>0?Math.round(t.reduce((i,u)=>i+u.bestPercentage,0)/f):0,c=[{label:"0–49%",min:0,max:49,color:"#fca5a5"},{label:"50–69%",min:50,max:69,color:"#fcd34d"},{label:"70–89%",min:70,max:89,color:"#6ee7b7"},{label:"90–100%",min:90,max:100,color:"#34d399"}],b=c.map(i=>t.filter(u=>u.bestPercentage>=i.min&&u.bestPercentage<=i.max).length),v=Math.max(...b,1),E=t.filter(i=>{const u=z.toLowerCase();return!u||i.studentName.toLowerCase().includes(u)||i.studentDisplayId.toLowerCase().includes(u)||i.studentSection.toLowerCase().includes(u)||i.studentCampus.toLowerCase().includes(u)});function R(i){return[...i].sort((u,C)=>{let p=0;return s==="name"?p=u.studentName.localeCompare(C.studentName):s==="score"?p=u.bestPercentage-C.bestPercentage:s==="attempts"?p=u.attemptCount-C.attemptCount:p=u.lastAttemptAt.getTime()-C.lastAttemptAt.getTime(),A==="asc"?p:-p})}function m(i){s===i?N(u=>u==="asc"?"desc":"asc"):(w(i),N("desc"))}function k({k:i}){return s!==i?e.jsx(Y,{size:13,style:{opacity:.4}}):A==="asc"?e.jsx(te,{size:13}):e.jsx(Y,{size:13})}if(o)return e.jsx("div",{className:"flex justify-center py-8",children:e.jsx("div",{className:"w-6 h-6 rounded-full border-2 animate-spin",style:{borderColor:"rgba(5,150,105,0.2)",borderTopColor:"#059669"}})});const n=R(E);return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("p",{className:"text-xs font-semibold uppercase tracking-wider",style:{color:"#059669"},children:["Student Results — ",Ot]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:[{icon:_e,label:"Students Attempted",value:f,sub:`max ${de} attempts each`},{icon:Be,label:"Average Best Score",value:`${l}%`,sub:"across all students"},{icon:Se,label:`Passed (>${Z}%)`,value:g,sub:`of ${f} student${f!==1?"s":""}`},{icon:G,label:`Distinction Badge (≥${ke}% 1st)`,value:d,sub:"first-attempt distinction"}].map(({icon:i,label:u,value:C,sub:p})=>e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(209,250,229,0.9), rgba(167,243,208,0.7))",borderColor:"rgba(5,150,105,0.18)"},children:[e.jsx(i,{size:18,style:{color:"#059669",marginBottom:6}}),e.jsx("p",{className:"text-xl font-extrabold",style:{color:"#065f46"},children:C}),e.jsx("p",{className:"text-xs font-semibold mt-0.5",style:{color:"#065f46"},children:u}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:"#6b7280"},children:p})]},u))}),f>0&&e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"rgba(255,255,255,0.6)",borderColor:"rgba(5,150,105,0.15)"},children:[e.jsx("p",{className:"text-xs font-semibold mb-3",style:{color:"#065f46"},children:"Score Distribution (best attempt per student)"}),e.jsx("div",{className:"flex items-end gap-3",children:c.map((i,u)=>e.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1",children:[e.jsx("p",{className:"text-xs font-bold",style:{color:"#374151"},children:b[u]}),e.jsx("div",{className:"w-full rounded-t-lg transition-all",style:{height:Math.max(4,b[u]/v*80),background:i.color}}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:i.label})]},i.label))}),e.jsxs("div",{className:"mt-3 flex items-center gap-4 text-xs",style:{color:"#6b7280"},children:[e.jsxs("span",{children:["Pass threshold: >",Z,"%"]}),e.jsx("span",{children:"·"}),e.jsxs("span",{children:["Distinction badge: ≥",ke,"% on 1st attempt"]})]})]}),e.jsxs("div",{className:"rounded-2xl border overflow-hidden",style:{borderColor:"rgba(5,150,105,0.18)"},children:[e.jsxs("div",{className:"px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between",style:{background:"linear-gradient(135deg, rgba(209,250,229,0.95), rgba(167,243,208,0.85))"},children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#065f46"},children:"All Students"}),e.jsx("input",{type:"text",placeholder:"Filter by name, ID, section…",value:z,onChange:i=>M(i.target.value),className:"input-field text-xs py-1.5 w-full sm:w-56"})]}),n.length===0?e.jsx("div",{className:"px-4 py-8 text-center",children:e.jsx("p",{className:"text-sm",style:{color:"#9ca3af"},children:t.length===0?"No quiz submissions yet.":"No results match the filter."})}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{background:"rgba(209,250,229,0.6)",borderBottom:"1px solid rgba(5,150,105,0.1)"},children:[[{k:"name",label:"Student"},{k:"score",label:"Best Score"},{k:"attempts",label:"Attempts"},{k:"date",label:"Last Attempt"}].map(({k:i,label:u})=>e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#065f46",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"},onClick:()=>m(i),children:e.jsxs("span",{className:"inline-flex items-center gap-1",children:[u," ",e.jsx(k,{k:i})]})},i)),e.jsx("th",{className:"px-4 py-2 text-left",style:{color:"#065f46",fontSize:11,fontWeight:700},children:"Status"})]})}),e.jsx("tbody",{children:n.map((i,u)=>{const C=i.bestPercentage>Z?i.bestPercentage>=ke?"#059669":"#d97706":"#dc2626",p=S===i.studentUid;return e.jsxs(e.Fragment,{children:[e.jsxs("tr",{style:{borderBottom:p?"none":"1px solid rgba(5,150,105,0.07)",background:u%2===0?"rgba(255,255,255,0.5)":"rgba(209,250,229,0.25)",cursor:"pointer"},onClick:()=>D(p?null:i.studentUid),children:[e.jsxs("td",{className:"px-4 py-3",children:[e.jsxs("div",{className:"flex items-center gap-1.5",children:[e.jsx("p",{className:"font-semibold",style:{color:"#1e1b4b",fontSize:13},children:i.studentName}),i.badgeEarned&&e.jsx(G,{size:13,className:"fill-amber-500 text-amber-500 stroke-0"})]}),i.studentDisplayId&&e.jsx("p",{style:{color:"#9ca3af",fontSize:11},children:i.studentDisplayId}),(i.studentCampus||i.studentSection)&&e.jsx("p",{style:{color:"#9ca3af",fontSize:11},children:[i.studentCampus,i.studentSection].filter(Boolean).join(" · ")})]}),e.jsx("td",{className:"px-4 py-3",children:e.jsxs("span",{className:"inline-flex items-center font-bold text-xs px-2.5 py-1 rounded-full",style:{background:i.passed?"rgba(209,250,229,0.8)":"rgba(254,226,226,0.8)",color:C},children:[i.bestPercentage,"%"]})}),e.jsxs("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:[i.attemptCount,"/",de]}),e.jsx("td",{className:"px-4 py-3",style:{color:"#6b7280",fontSize:12},children:zt(i.lastAttemptAt)}),e.jsx("td",{className:"px-4 py-3",children:e.jsx("span",{className:"text-xs font-semibold px-2 py-0.5 rounded-full",style:{background:i.passed?"rgba(209,250,229,0.7)":"rgba(254,226,226,0.7)",color:i.passed?"#065f46":"#991b1b"},children:i.passed?"Passed":"Not Passed"})})]},i.studentUid),p&&e.jsx("tr",{style:{borderBottom:"1px solid rgba(5,150,105,0.07)"},children:e.jsx("td",{colSpan:5,className:"px-4 pb-3 pt-0",style:{background:u%2===0?"rgba(255,255,255,0.5)":"rgba(209,250,229,0.25)"},children:e.jsxs("div",{className:"rounded-xl overflow-hidden border",style:{borderColor:"rgba(5,150,105,0.12)"},children:[e.jsx("div",{className:"px-3 py-2",style:{background:"rgba(209,250,229,0.8)"},children:e.jsx("p",{className:"text-xs font-bold",style:{color:"#065f46"},children:"Attempt History"})}),e.jsx("div",{className:"divide-y",style:{borderColor:"rgba(5,150,105,0.08)"},children:i.attempts.map((y,x)=>e.jsxs("div",{className:"flex items-center justify-between px-3 py-2",style:{background:"rgba(255,255,255,0.7)"},children:[e.jsxs("span",{className:"text-xs",style:{color:"#6b7280"},children:["Attempt ",x+1,x===0&&i.badgeEarned&&e.jsx(G,{size:11,className:"fill-amber-500 text-amber-500 stroke-0 inline ml-1"})]}),e.jsxs("span",{className:"text-xs font-semibold",style:{color:y.percentage>Z?"#059669":"#dc2626"},children:[y.score,"/",y.total," (",y.percentage,"%) · ",zt(y.completedAt)]})]},x))})]})})},`${i.studentUid}-expanded`)]})})})]})})]})]})}const Nt="apa-v7-unlocked",ti=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

.apa *{box-sizing:border-box;margin:0;padding:0}
.apa{font-family:'Inter',sans-serif;
  --title:64px;--h2:48px;--body:32px;--small:26px;--tiny:22px;--micro:19px;
  --px:88px;--pt:68px;--pb:52px;--title-gap:30px;--item-gap:18px;
  --navy:#0f172a;--navy2:#1e1b4b;
  --indigo:#3730a3;--indigo2:#4338ca;--indigo3:#6366f1;--indigo-light:#e0e7ff;
  --purple:#7c3aed;--purple-light:#ede9fe;
  --amber:#b45309;--amber2:#d97706;--gold:#f59e0b;--gold-light:#fef3c7;
  --teal:#0d9488;--teal2:#14b8a6;--teal-light:#ccfbf1;
  --rose:#e11d48;--rose-light:#ffe4e6;
  --green:#059669;--green-light:#d1fae5;
  --slate:#475569;--white:#f8fafc;--off-white:#eef2ff
}
.apa section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:#1e293b}
.apa section.dark{background:var(--navy);color:#f1f5f9}
.apa section.dark-indigo{background:var(--navy2);color:#f1f5f9}
.apa section.warm{background:#fffbeb;color:#1e293b}
.apa section.slate-bg{background:#f1f5f9;color:#1e293b}

.apa .slide-title{font-size:var(--title);font-weight:800;line-height:1.08;letter-spacing:-0.025em;margin-bottom:var(--title-gap)}
.apa .slide-title .accent{color:var(--indigo2)}
.apa section.dark .slide-title .accent,.apa section.dark-indigo .slide-title .accent{color:#a5b4fc}
.apa .section-label{font-size:var(--small);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--indigo2);margin-bottom:16px}
.apa section.dark .section-label,.apa section.dark-indigo .section-label{color:#a5b4fc}
.apa section.warm .section-label{color:var(--amber2)}

.apa .body{font-size:var(--body);line-height:1.55}
.apa .small{font-size:var(--small);line-height:1.5}
.apa .tiny{font-size:var(--tiny);line-height:1.5}
.apa .micro{font-size:var(--micro);line-height:1.5}

.apa .two-col{display:grid;grid-template-columns:1fr 1fr;gap:48px;flex:1;align-items:start}
.apa .two-col.eq{align-items:stretch}
.apa .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;flex:1;align-items:stretch}
.apa .four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;flex:1;align-items:stretch}
.apa .five-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:20px;flex:1;align-items:stretch}
.apa .two-row{display:grid;grid-template-rows:1fr 1fr;gap:24px;flex:1}

.apa .callout{border-radius:18px;padding:22px 30px;font-size:var(--body);line-height:1.55}
.apa .callout-indigo{background:var(--indigo-light);border-left:7px solid var(--indigo2)}
.apa .callout-amber{background:var(--gold-light);border-left:7px solid var(--gold)}
.apa .callout-teal{background:var(--teal-light);border-left:7px solid var(--teal)}
.apa .callout-rose{background:var(--rose-light);border-left:7px solid var(--rose)}
.apa .callout-green{background:var(--green-light);border-left:7px solid var(--green)}
.apa .callout-purple{background:var(--purple-light);border-left:7px solid var(--purple)}
.apa section.dark .callout-indigo{background:rgba(67,56,202,0.22);border-left-color:#818cf8;color:#c7d2fe}

.apa .badge{display:inline-block;font-size:var(--tiny);font-weight:700;padding:7px 22px;border-radius:999px;letter-spacing:0.04em}
.apa .badge-indigo{background:var(--indigo2);color:#fff}
.apa .badge-amber{background:var(--gold);color:#fff}
.apa .badge-teal{background:var(--teal);color:#fff}
.apa .badge-rose{background:var(--rose);color:#fff}
.apa .badge-green{background:var(--green);color:#fff}
.apa .badge-purple{background:var(--purple);color:#fff}
.apa .badge-ghost{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2)}

.apa table{border-collapse:collapse;font-size:var(--small);width:100%}
.apa th{background:var(--navy2);color:#fff;padding:14px 22px;text-align:left;font-weight:600;font-size:var(--tiny)}
.apa td{padding:12px 22px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle;font-size:var(--tiny)}
.apa tr:nth-child(even) td{background:#f8fafc}
.apa tr:hover td{background:var(--indigo-light);transition:background 0.18s}
.apa .tbl-indigo th{background:var(--indigo2)}
.apa .tbl-dark th{background:#0f172a}
.apa .highlight-row td{background:#fef3c7 !important;font-weight:700}

.apa ul.check{list-style:none;display:flex;flex-direction:column;gap:10px}
.apa ul.check li{font-size:var(--small);line-height:1.5;padding-left:36px;position:relative}
.apa ul.check li::before{content:'✓';position:absolute;left:0;font-weight:800;color:var(--teal);font-size:var(--small)}
.apa section.dark ul.check li::before{color:#5eead4}
.apa ul.cross{list-style:none;display:flex;flex-direction:column;gap:10px}
.apa ul.cross li{font-size:var(--small);line-height:1.5;padding-left:36px;position:relative}
.apa ul.cross li::before{content:'✗';position:absolute;left:0;font-weight:800;color:var(--rose);font-size:var(--small)}

.apa .main-title{font-size:92px;font-weight:900;line-height:1.0;letter-spacing:-0.03em;color:#fff;margin-bottom:24px}
.apa .main-title .accent{color:#a5b4fc}
.apa .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1100px}
.apa .copyright{position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:18px;color:rgba(0,0,0,0.16);letter-spacing:0.04em}
.apa section.dark .copyright,.apa section.dark-indigo .copyright{color:rgba(255,255,255,0.16)}
.apa .deco-circle{position:absolute;border-radius:50%;pointer-events:none}

/* Interactive cite cards */
.apa .cite-card{border-radius:20px;padding:28px 26px;cursor:pointer;transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1);border:2px solid rgba(99,102,241,0.15);background:rgba(255,255,255,0.85);user-select:none}
.apa .cite-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 16px 40px rgba(67,56,202,0.15);border-color:var(--indigo2)}
.apa .cite-card[data-revealed='true']{background:var(--indigo-light);border-color:var(--indigo2);transform:translateY(-4px);box-shadow:0 12px 32px rgba(67,56,202,0.2)}
.apa .cite-card .hint-text{font-size:var(--micro);color:var(--slate);margin-top:8px;opacity:0.7}
.apa .cite-card .reveal-content{display:none;margin-top:12px;padding-top:12px;border-top:1.5px dashed rgba(67,56,202,0.3);font-size:var(--micro);color:var(--indigo);font-weight:600;line-height:1.5}
.apa .cite-card[data-revealed='true'] .reveal-content{display:block}
.apa .cite-card[data-revealed='true'] .hint-text{display:none}

/* Mistake cards */
.apa .mistake-card{border-radius:18px;padding:22px 20px;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.9);border:2px solid rgba(225,29,72,0.15);user-select:none}
.apa .mistake-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(225,29,72,0.12);border-color:var(--rose)}
.apa .mistake-card[data-open='true']{background:var(--rose-light);border-color:var(--rose);transform:translateY(-4px);box-shadow:0 12px 28px rgba(225,29,72,0.18)}
.apa .mistake-card .fix{display:none;margin-top:10px;padding-top:10px;border-top:1.5px dashed rgba(225,29,72,0.3);font-size:var(--micro);color:#9f1239;line-height:1.5}
.apa .mistake-card[data-open='true'] .fix{display:block}
.apa .mistake-title{font-size:var(--tiny);font-weight:700;color:#1e293b;line-height:1.3}
.apa .mistake-card[data-open='true'] .mistake-title{color:#9f1239}

/* Code/citation blocks */
.apa .code-block{background:#1e293b;border-radius:16px;padding:26px 34px;font-family:'Courier New',monospace;font-size:var(--small);color:#e2e8f0;line-height:1.7;position:relative}
.apa .code-label{position:absolute;top:-14px;left:20px;background:var(--indigo2);color:white;font-family:'Inter',sans-serif;font-size:var(--micro);font-weight:700;padding:4px 18px;border-radius:999px;letter-spacing:0.06em}
.apa .ca{color:#a5b4fc}
.apa .cy{color:#fbbf24}
.apa .cp{color:#5eead4}
.apa .ct{color:#f9a8d4;font-style:italic}
.apa .cj{color:#86efac;font-style:italic}
.apa .cd{color:#fb923c}

/* Annotation labels */
.apa .ann{position:absolute;font-size:18px;font-weight:700;font-family:'Inter',sans-serif;white-space:nowrap;pointer-events:none}
.apa .ann-line{position:absolute;border:2px dashed;pointer-events:none}

/* Reference anatomy */
.apa .ref-part{display:inline;border-radius:6px;padding:2px 8px;cursor:pointer;transition:all 0.2s;position:relative}
.apa .ref-part:hover{filter:brightness(0.92);transform:scale(1.02)}
.apa .who-part{background:#ddd6fe;color:#4c1d95}
.apa .when-part{background:#fef3c7;color:#92400e}
.apa .what-part{background:#ccfbf1;color:#134e4a}
.apa .where-part{background:#ffe4e6;color:#9f1239}

/* Flow diagram */
.apa .flow-box{border-radius:24px;padding:32px 28px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;position:relative}
.apa .flow-box.in-text{background:linear-gradient(135deg,rgba(67,56,202,0.15),rgba(99,102,241,0.08));border:2.5px solid rgba(67,56,202,0.4)}
.apa .flow-box.ref-list{background:linear-gradient(135deg,rgba(13,148,136,0.15),rgba(20,184,166,0.08));border:2.5px solid rgba(13,148,136,0.4)}
.apa .flow-icon{font-size:52px;line-height:1}
.apa .flow-title{font-size:var(--body);font-weight:800;color:#fff}
.apa .flow-desc{font-size:var(--small);color:rgba(255,255,255,0.6);line-height:1.5}

/* Scenario compare */
.apa .scenario{border-radius:22px;padding:30px 34px;flex:1;display:flex;flex-direction:column;gap:14px}
.apa .scenario.bad{background:linear-gradient(135deg,rgba(254,226,226,0.95),rgba(252,165,165,0.45));border:2px solid rgba(239,68,68,0.3)}
.apa .scenario.good{background:linear-gradient(135deg,rgba(209,250,229,0.95),rgba(167,243,208,0.45));border:2px solid rgba(5,150,105,0.3)}
.apa .scenario-tag{font-size:var(--tiny);font-weight:800;letter-spacing:0.08em;text-transform:uppercase}
.apa .bad .scenario-tag{color:#dc2626}
.apa .good .scenario-tag{color:#059669}
.apa .scenario-quote{font-family:'Lora',serif;font-size:var(--small);font-style:italic;line-height:1.65;color:#334155}
.apa .scenario-note{font-size:var(--micro);font-weight:500;color:#64748b;margin-top:8px}
.apa .bad .scenario-note{color:#991b1b}
.apa .good .scenario-note{color:#065f46}

/* Pillar cards */
.apa .pillar{border-radius:24px;padding:34px 28px;display:flex;flex-direction:column;gap:14px;flex:1}
.apa .pillar-icon{font-size:54px;line-height:1}
.apa .pillar-title{font-size:var(--body);font-weight:800}
.apa .pillar-body{font-size:var(--small);line-height:1.55;opacity:0.85}

/* Animations */
@keyframes apa-fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes apa-pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)}70%{box-shadow:0 0 0 22px rgba(99,102,241,0)}}
@keyframes apa-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes apa-glow{0%,100%{opacity:0.5}50%{opacity:1}}
@keyframes apa-bounce{0%,100%{transform:translateX(0)}25%{transform:translateX(8px)}75%{transform:translateX(-8px)}}

.apa .fu{animation:apa-fadeUp 0.55s ease-out both}
.apa .fu1{animation:apa-fadeUp 0.55s 0.1s ease-out both}
.apa .fu2{animation:apa-fadeUp 0.55s 0.22s ease-out both}
.apa .fu3{animation:apa-fadeUp 0.55s 0.36s ease-out both}
.apa .fu4{animation:apa-fadeUp 0.55s 0.5s ease-out both}
.apa .fu5{animation:apa-fadeUp 0.55s 0.64s ease-out both}
.apa .fu6{animation:apa-fadeUp 0.55s 0.78s ease-out both}
.apa .pulse-ring{animation:apa-pulse 2.2s ease-out infinite}
.apa .float{animation:apa-float 3s ease-in-out infinite}
.apa .glow{animation:apa-glow 2s ease-in-out infinite}

/* Step list */
.apa .step-list{display:flex;flex-direction:column;gap:16px}
.apa .step{display:flex;gap:18px;align-items:flex-start}
.apa .step-num{width:44px;height:44px;border-radius:50%;background:var(--indigo2);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;margin-top:2px}
.apa .step-text{font-size:var(--small);line-height:1.5;flex:1}
`,it=[{classes:"dark-indigo",label:"1 APA 7 – Introduction",html:`
    <div class="deco-circle" style="width:820px;height:820px;background:radial-gradient(circle,rgba(99,102,241,0.22) 0%,transparent 70%);right:-180px;top:-220px;"></div>
    <div class="deco-circle" style="width:560px;height:560px;background:radial-gradient(circle,rgba(245,158,11,0.14) 0%,transparent 70%);left:-100px;bottom:-120px;"></div>
    <div class="deco-circle float" style="width:200px;height:200px;background:radial-gradient(circle,rgba(165,180,252,0.18) 0%,transparent 70%);left:40%;top:10%;"></div>
    <div class="title-slide-inner fu">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:38px;">
        <div style="display:flex;gap:8px;align-items:center;">
          <div style="width:56px;height:7px;background:#818cf8;border-radius:4px;"></div>
          <div style="width:28px;height:7px;background:#f59e0b;border-radius:4px;"></div>
          <div style="width:14px;height:7px;background:#5eead4;border-radius:4px;"></div>
        </div>
        <span style="font-size:var(--small);font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#a5b4fc;">General Resources · Academic Writing Skills</span>
      </div>
      <div class="main-title">APA <span class="accent">7</span><br/>Citations</div>
      <p style="font-size:44px;color:rgba(255,255,255,0.55);margin-bottom:44px;font-weight:300;font-family:'Lora',serif;font-style:italic;">The Crash Course</p>
      <p style="font-size:var(--body);color:rgba(255,255,255,0.48);max-width:920px;line-height:1.65;margin-bottom:50px;">Everything you need to cite correctly — from the first in-text citation to the last reference entry. Built for your assignments. No textbooks required.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <span class="badge badge-ghost">14 Slides</span>
        <span class="badge badge-amber">Interactive Examples</span>
        <span class="badge badge-teal">Reference Templates</span>
        <span class="badge badge-purple">Practice Quiz Included</span>
      </div>
    </div>
    <div style="position:absolute;right:var(--px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:24px;opacity:0.18;">
      <div style="width:140px;height:140px;border-radius:28px;border:3px solid #a5b4fc;display:flex;align-items:center;justify-content:center;font-size:72px;">📖</div>
      <div style="width:140px;height:140px;border-radius:28px;border:3px solid #f59e0b;display:flex;align-items:center;justify-content:center;font-size:72px;">✍️</div>
      <div style="width:140px;height:140px;border-radius:28px;border:3px solid #5eead4;display:flex;align-items:center;justify-content:center;font-size:72px;">🎓</div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"2 Why Even Cite?",html:`
    <div class="section-label">The Foundation</div>
    <div class="slide-title">Why Even <span class="accent">Bother</span> Citing?</div>
    <div class="three-col">
      <div class="pillar fu1" style="background:linear-gradient(135deg,rgba(224,231,255,0.9),rgba(199,210,254,0.5));border:2px solid rgba(99,102,241,0.25);">
        <div class="pillar-icon">🛡️</div>
        <div class="pillar-title" style="color:var(--indigo2);">They Protect You</div>
        <div class="pillar-body" style="color:#334155;">Using someone's idea without credit is <strong>plagiarism</strong> — even accidentally. A citation is your proof you know the difference between your thinking and someone else's. No citation = no defence.</div>
        <div style="margin-top:auto;padding:12px 18px;background:rgba(67,56,202,0.1);border-radius:12px;font-size:var(--micro);color:var(--indigo2);font-weight:600;">Academic integrity shield</div>
      </div>
      <div class="pillar fu2" style="background:linear-gradient(135deg,rgba(204,251,241,0.9),rgba(153,246,228,0.5));border:2px solid rgba(13,148,136,0.25);">
        <div class="pillar-icon">💪</div>
        <div class="pillar-title" style="color:var(--teal);">They Strengthen You</div>
        <div class="pillar-body" style="color:#334155;"><em>"Immersion increases presence"</em> — opinion.<br/><br/><em>"Immersion increases presence (Slater, 2009)"</em> — claim backed by a decade of VR research.<br/><br/>Same sentence. <strong>Completely different weight.</strong></div>
        <div style="margin-top:auto;padding:12px 18px;background:rgba(13,148,136,0.1);border-radius:12px;font-size:var(--micro);color:var(--teal);font-weight:600;">Evidence = credibility</div>
      </div>
      <div class="pillar fu3" style="background:linear-gradient(135deg,rgba(254,243,199,0.9),rgba(253,230,138,0.5));border:2px solid rgba(245,158,11,0.3);">
        <div class="pillar-icon">💬</div>
        <div class="pillar-title" style="color:var(--amber2);">They Invite Conversation</div>
        <div class="pillar-body" style="color:#334155;">Academic writing isn't a monologue — it's you <strong>positioning your ideas</strong> within an ongoing scholarly debate. Citations show you've been listening, and you know who said what first.</div>
        <div style="margin-top:auto;padding:12px 18px;background:rgba(217,119,6,0.1);border-radius:12px;font-size:var(--micro);color:var(--amber2);font-weight:600;">Join the scholarly conversation</div>
      </div>
    </div>
    <div class="callout callout-indigo fu4" style="margin-top:24px;">
      <strong>The "says who?" test:</strong> Imagine your examiner asking <em>"says who?"</em> after every claim you make. Citations are your answer. Without them, you're just asserting things into the void.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"slate-bg",label:"3 Citation vs No Citation",html:`
    <div class="section-label">Real Impact</div>
    <div class="slide-title">Same Sentence. <span class="accent">Different Weight.</span></div>
    <div class="two-col eq" style="gap:40px;flex:1;">
      <div class="scenario bad fu1">
        <div class="scenario-tag">❌ Without citation</div>
        <div class="scenario-quote">"Scientists say coffee makes you smarter."</div>
        <div style="margin-top:16px;padding:16px 20px;background:rgba(239,68,68,0.1);border-radius:14px;">
          <p style="font-size:var(--tiny);color:#7f1d1d;font-weight:600;margin-bottom:8px;">What happens:</p>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> Examiner asks: <em>"Which scientists? Where? When?"</em></li>
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> Sounds like an unverified social media claim</li>
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> Could be penalised for unsupported assertion</li>
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> If it's someone else's idea — this is plagiarism</li>
          </ul>
        </div>
        <div class="scenario-note">Your friend (the examiner) is far less forgiving.</div>
      </div>
      <div class="scenario good fu2">
        <div class="scenario-tag">✅ With citation</div>
        <div class="scenario-quote">"Caffeine consumption has been associated with enhanced cognitive performance in controlled studies (Smith et al., 2021, p. 14)."</div>
        <div style="margin-top:16px;padding:16px 20px;background:rgba(5,150,105,0.1);border-radius:14px;">
          <p style="font-size:var(--tiny);color:#064e3b;font-weight:600;margin-bottom:8px;">What happens:</p>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> Reader can verify the source independently</li>
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> Shows engagement with academic literature</li>
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> Demonstrates scholarly credibility</li>
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> You are protected against plagiarism accusation</li>
          </ul>
        </div>
        <div class="scenario-note">Same idea. Now it's a <strong>verifiable academic claim.</strong></div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"4 When TO Cite (Interactive)",html:`
    <div class="section-label">Rule 1 of 2</div>
    <div class="slide-title">When <span class="accent">TO</span> Cite <span style="font-size:var(--small);font-weight:500;color:var(--slate);"> — click each card to reveal why</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;flex:1;">
      <div class="cite-card fu1" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">📊</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Facts, statistics &amp; findings</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Any fact that came from a specific study, dataset, or report. Even if widely known <em>within your field</em>, if it has a source — cite it. E.g. "87% of Agile teams use Scrum" needs the State of Agile report.</div>
      </div>
      <div class="cite-card fu2" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">💡</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Arguments &amp; theories</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Someone else's argument, model, or framework. Even if you're paraphrasing it — you're using their intellectual work. Presence theory (Witmer &amp; Singer), Agile Manifesto, TAM model — all need citations.</div>
      </div>
      <div class="cite-card fu3" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">📖</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Definitions</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Especially contested or field-specific definitions. "Presence is defined as..." is someone's definition — whose? Even for widely agreed terms, citing the first/key theorist shows depth and awareness.</div>
      </div>
      <div class="cite-card fu4" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">💬</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Direct quotes</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Obviously. Any word-for-word text from a source requires quote marks + author + year + page number. Even a single distinctive phrase taken verbatim needs a page-level citation.</div>
      </div>
      <div class="cite-card fu5" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">📏</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Scales &amp; instruments</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Surveys, questionnaires, measurement scales, or research instruments designed by others. The Presence Questionnaire, SUS, TAM scales — all have original authors who must be credited.</div>
      </div>
      <div class="cite-card fu6" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">✍️</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Your own prior work</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Yes — even your own previously published work. Reusing your own ideas without citing yourself is called <strong>self-plagiarism</strong>. If you published it elsewhere, treat it like any other source.</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"warm",label:"5 When NOT to Cite",html:`
    <div class="section-label">Rule 2 of 2</div>
    <div class="slide-title">When <span class="accent" style="color:var(--amber2);">NOT</span> to Cite</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="callout callout-amber fu1">
          <strong>Over-citing</strong> clutters your writing and actually signals <em>low confidence</em> — it looks like you can't tell what's common knowledge and what isn't.
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;" class="fu2">
          <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
            <span style="font-size:36px;flex-shrink:0;">🌐</span>
            <div>
              <div style="font-size:var(--small);font-weight:700;color:#92400e;">Common knowledge</div>
              <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">"The internet is widely used" — no citation needed. Any reasonably educated person already knows this.</div>
            </div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
            <span style="font-size:36px;flex-shrink:0;">🔢</span>
            <div>
              <div style="font-size:var(--small);font-weight:700;color:#92400e;">Mathematical or logical facts</div>
              <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">"The sample had 24 participants split into 4 groups of 6" — this is your own arithmetic. No source needed.</div>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;" class="fu3">
        <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
          <span style="font-size:36px;flex-shrink:0;">🧠</span>
          <div>
            <div style="font-size:var(--small);font-weight:700;color:#92400e;">Your own original analysis</div>
            <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">Your interpretation, argument, and conclusions are <em>your contribution</em>. Don't undercut it by citing someone else — own it.</div>
          </div>
        </div>
        <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
          <span style="font-size:36px;flex-shrink:0;">🔬</span>
          <div>
            <div style="font-size:var(--small);font-weight:700;color:#92400e;">Your own firsthand observations</div>
            <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">Things you observed, measured, or found in your own study. "Participants reported feeling dizzy" — this is your data.</div>
          </div>
        </div>
        <div style="padding:22px 26px;background:linear-gradient(135deg,rgba(180,83,9,0.12),rgba(217,119,6,0.08));border-radius:18px;border:2px solid rgba(217,119,6,0.3);">
          <div style="font-size:var(--small);font-weight:800;color:#92400e;margin-bottom:10px;">🎯 The Test</div>
          <div style="font-size:var(--tiny);color:#78350f;line-height:1.6;">Would a <strong>reasonable person in your field</strong> consider this general knowledge? If yes → no citation. If there's any doubt → cite it. When in doubt, cite.</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"6 The Core Rule",html:`
    <div class="deco-circle" style="width:700px;height:700px;background:radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 70%);right:-120px;top:-160px;"></div>
    <div class="section-label">The Golden Rule</div>
    <div class="slide-title">One In-Text → <span class="accent">One Entry.</span> Always.</div>
    <div style="display:flex;gap:48px;flex:1;align-items:center;">
      <div style="flex:1;display:flex;flex-direction:column;gap:20px;" class="fu1">
        <div style="padding:28px 32px;background:rgba(255,255,255,0.05);border-radius:24px;border:2px solid rgba(165,180,252,0.25);">
          <div style="font-size:var(--h2);font-weight:900;color:#e2e8f0;line-height:1.2;margin-bottom:16px;">Every in-text citation has exactly <span style="color:#a5b4fc;">one</span> matching entry in the reference list.</div>
          <div style="font-size:var(--body);color:rgba(255,255,255,0.5);line-height:1.6;">Every reference list entry is cited <span style="color:#5eead4;">somewhere</span> in the text. No orphans. No extras.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="padding:18px 22px;background:rgba(225,29,72,0.1);border-radius:16px;border:1.5px solid rgba(225,29,72,0.3);">
            <div style="font-size:var(--tiny);font-weight:800;color:#fb7185;margin-bottom:8px;">❌ ORPHAN</div>
            <div style="font-size:var(--micro);color:rgba(255,255,255,0.5);line-height:1.5;">A reference list entry with no matching in-text citation. You read it, but never cited it. Remove it — APA is not a bibliography.</div>
          </div>
          <div style="padding:18px 22px;background:rgba(225,29,72,0.1);border-radius:16px;border:1.5px solid rgba(225,29,72,0.3);">
            <div style="font-size:var(--tiny);font-weight:800;color:#fb7185;margin-bottom:8px;">❌ GHOST</div>
            <div style="font-size:var(--micro);color:rgba(255,255,255,0.5);line-height:1.5;">An in-text citation (Brown, 2021) with no matching reference list entry. Always fatal — the reader can't find the source.</div>
          </div>
        </div>
      </div>
      <div style="flex:0 0 520px;display:flex;flex-direction:column;align-items:center;gap:20px;" class="fu2">
        <div class="flow-box in-text pulse-ring" style="width:100%;padding:36px 32px;">
          <div class="flow-icon">📝</div>
          <div class="flow-title">In-Text Citation</div>
          <div class="flow-desc">(Slater, 2009, p. 12)<br/>Smith and Jones (2021)</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0.6;">
          <div style="width:4px;height:28px;background:rgba(255,255,255,0.3);border-radius:2px;"></div>
          <div style="font-size:36px;color:rgba(255,255,255,0.4);">↕</div>
          <div style="font-size:var(--micro);color:rgba(255,255,255,0.35);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">One-to-one match</div>
          <div style="width:4px;height:28px;background:rgba(255,255,255,0.3);border-radius:2px;"></div>
        </div>
        <div class="flow-box ref-list" style="width:100%;padding:36px 32px;">
          <div class="flow-icon">📚</div>
          <div class="flow-title">Reference List Entry</div>
          <div class="flow-desc">Slater, M. (2009). Place illusion...<br/><em>Phil. Trans. R. Soc. B</em>, 364...</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"7 In-Text: Two Flavours",html:`
    <div class="section-label">In-Text Citations</div>
    <div class="slide-title">Two <span class="accent">Flavours</span> of In-Text Citation</div>
    <div class="two-col eq" style="gap:44px;flex:1;">
      <div style="display:flex;flex-direction:column;gap:20px;" class="fu1">
        <div style="padding:22px 28px;background:linear-gradient(135deg,rgba(224,231,255,0.9),rgba(199,210,254,0.5));border-radius:20px;border:2px solid rgba(99,102,241,0.3);">
          <div style="font-size:var(--small);font-weight:800;color:var(--indigo2);margin-bottom:4px;">1 — Parenthetical</div>
          <div style="font-size:var(--micro);color:var(--slate);">Citation lives in brackets at the end</div>
        </div>
        <div class="code-block">
          <div class="code-label">EXAMPLE</div>
          Virtual environments have been shown to enhance spatial memory <span class="ca">(Bowman &amp; McMahan, 2007)</span>.
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="padding:16px 20px;background:rgba(99,102,241,0.06);border-radius:14px;border:1.5px solid rgba(99,102,241,0.15);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--indigo2);margin-bottom:6px;">📌 Use this when:</div>
            <div style="font-size:var(--micro);color:var(--slate);line-height:1.5;">The <strong>idea</strong> matters more than the person who said it. You're reporting a finding, not engaging with a specific author's argument.</div>
          </div>
          <div style="padding:16px 20px;background:rgba(99,102,241,0.06);border-radius:14px;border:1.5px solid rgba(99,102,241,0.15);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--indigo2);margin-bottom:6px;">📐 Format:</div>
            <div style="font-size:var(--micro);color:var(--slate);font-family:'Courier New',monospace;">(Author, Year) or (Author, Year, p. N)</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;" class="fu2">
        <div style="padding:22px 28px;background:linear-gradient(135deg,rgba(204,251,241,0.9),rgba(153,246,228,0.5));border-radius:20px;border:2px solid rgba(13,148,136,0.3);">
          <div style="font-size:var(--small);font-weight:800;color:var(--teal);margin-bottom:4px;">2 — Narrative</div>
          <div style="font-size:var(--micro);color:var(--slate);">Author is part of your sentence, year follows in brackets</div>
        </div>
        <div class="code-block">
          <div class="code-label">EXAMPLE</div>
          <span class="ca">Bowman and McMahan</span> <span class="cy">(2007)</span> demonstrated that virtual environments enhance spatial memory.
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="padding:16px 20px;background:rgba(13,148,136,0.06);border-radius:14px;border:1.5px solid rgba(13,148,136,0.2);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--teal);margin-bottom:6px;">📌 Use this when:</div>
            <div style="font-size:var(--micro);color:var(--slate);line-height:1.5;">You're specifically engaging with <strong>who</strong> said something. You're introducing their argument, critiquing it, or contrasting it with another author's view.</div>
          </div>
          <div style="padding:16px 20px;background:rgba(13,148,136,0.06);border-radius:14px;border:1.5px solid rgba(13,148,136,0.2);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--teal);margin-bottom:6px;">📐 Format:</div>
            <div style="font-size:var(--micro);color:var(--slate);font-family:'Courier New',monospace;">Author (Year) verb... or Author and Author (Year)...</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"slate-bg",label:"8 Author–Year Cheat Sheet",html:`
    <div class="section-label">Quick Reference</div>
    <div class="slide-title">The Author–Year <span class="accent">Cheat Sheet</span></div>
    <table class="tbl-indigo fu1" style="flex:1;">
      <thead>
        <tr>
          <th style="width:34%;">Situation</th>
          <th style="width:40%;">Format</th>
          <th style="width:26%;">Example</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1 author</td><td>(Author, Year)</td><td>(Slater, 2009)</td></tr>
        <tr><td>2 authors</td><td>(Author &amp; Author, Year)</td><td>(Slater &amp; Sanchez-Vives, 2016)</td></tr>
        <tr class="highlight-row"><td>⭐ 3+ authors <span style="font-size:15px;font-weight:800;color:#92400e;"> APA 7 change!</span></td><td>First author + et al., from first use</td><td>(Cummings et al., 2020)</td></tr>
        <tr><td>Organisation (first mention)</td><td>(Full Name [ABBR], Year)</td><td>(World Health Organization [WHO], 2022)</td></tr>
        <tr><td>Organisation (subsequent)</td><td>(Abbreviation, Year)</td><td>(WHO, 2022)</td></tr>
        <tr><td>No date available</td><td>(Author, n.d.)</td><td>(Smith, n.d.)</td></tr>
        <tr><td>Same author, same year</td><td>(Author, Yeara, Yearb)</td><td>(Brown, 2021a, 2021b)</td></tr>
        <tr><td>Multiple sources together</td><td>(Auth1 &amp; Auth2, Year; Auth3, Year)</td><td>(Milgram &amp; Kishino, 1994; Witmer &amp; Singer, 1998)</td></tr>
        <tr><td>Direct quote</td><td>(Author, Year, p. N)</td><td>(Witmer &amp; Singer, 1998, p. 225)</td></tr>
      </tbody>
    </table>
    <div style="margin-top:18px;padding:14px 22px;background:linear-gradient(135deg,rgba(254,243,199,0.95),rgba(253,230,138,0.6));border-radius:14px;border:2px solid rgba(245,158,11,0.4);" class="fu2">
      <span style="font-size:var(--tiny);font-weight:800;color:#92400e;">⭐ APA 7 key change:</span><span style="font-size:var(--tiny);color:#78350f;"> Three or more authors → use <strong>et al.</strong> from the very FIRST citation. APA 6 made you write all names up to 5 authors first. That rule is gone.</span>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"9 Short Quotes (Under 40 Words)",html:`
    <div class="section-label">Direct Quotation · Part 1</div>
    <div class="slide-title">Short Quotes: <span class="accent">Under 40 Words</span></div>
    <div style="display:flex;flex-direction:column;gap:28px;flex:1;">
      <div style="display:flex;gap:32px;align-items:stretch;" class="fu1">
        <div style="flex:1;padding:32px 36px;background:linear-gradient(135deg,rgba(224,231,255,0.7),rgba(199,210,254,0.35));border-radius:22px;border:2.5px solid rgba(99,102,241,0.25);font-family:'Lora',serif;font-size:var(--small);font-style:italic;line-height:1.75;color:#1e293b;position:relative;">
          <span style="color:var(--indigo2);font-size:60px;line-height:0;vertical-align:-20px;font-weight:900;">"</span>Presence is defined as
          <span style="background:#ddd6fe;border-radius:4px;padding:1px 6px;font-style:normal;font-size:var(--tiny);font-weight:600;color:#4c1d95;">the subjective experience of being in one place or environment, even when one is physically situated in another</span>
          <span style="color:var(--indigo2);font-size:60px;line-height:0;vertical-align:-20px;font-weight:900;">"</span>
          <span style="font-style:normal;font-size:var(--tiny);color:var(--slate);"> (<span style="color:var(--indigo2);font-weight:700;">Witmer &amp; Singer</span>, <span style="color:var(--amber2);font-weight:700;">1998</span>, p. <span style="color:var(--teal);font-weight:700;">225</span>).</span>
        </div>
      </div>
      <div class="two-col fu2" style="gap:24px;flex:none;">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:var(--small);font-weight:800;color:var(--indigo2);margin-bottom:4px;">✅ Format Rules</div>
          <ul class="check">
            <li>Quotation marks around the exact words</li>
            <li>Inline — <em>do not</em> break to a new paragraph</li>
            <li>Page number is required (<span style="font-family:'Courier New';font-size:22px;">p. 225</span>)</li>
            <li>Citation at end, before the full stop</li>
          </ul>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:var(--small);font-weight:800;color:var(--rose);margin-bottom:4px;">❌ Common Errors</div>
          <ul class="cross">
            <li>Missing page number on a direct quote</li>
            <li>Using a block quote format for under 40 words</li>
            <li>Altering words inside the quote without [brackets]</li>
            <li>Overusing quotes — paraphrase instead</li>
          </ul>
        </div>
      </div>
      <div class="callout callout-amber fu3">
        <strong>Honest advice:</strong> Your examiner wants to see you <em>synthesise</em> ideas, not collect them. Use direct quotes only when the exact wording matters — definitions, key terms, pivotal statements. A paraphrase that cites correctly shows more skill.
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark",label:"10 Block Quotes (40+ Words)",html:`
    <div class="deco-circle" style="width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%);right:-80px;bottom:-80px;"></div>
    <div class="section-label">Direct Quotation · Part 2</div>
    <div class="slide-title">Block Quotes: <span class="accent">40+ Words</span></div>
    <div style="display:flex;gap:40px;flex:1;" class="fu1">
      <div style="flex:1.1;display:flex;flex-direction:column;gap:20px;">
        <div style="padding:28px 36px;background:rgba(255,255,255,0.05);border:2px solid rgba(165,180,252,0.25);border-radius:20px;">
          <div style="font-size:var(--tiny);font-weight:700;color:#a5b4fc;margin-bottom:14px;">Slater (2018) argued:</div>
          <div style="padding-left:48px;border-left:4px solid rgba(165,180,252,0.4);">
            <p style="font-family:'Lora',serif;font-size:var(--small);font-style:italic;color:rgba(255,255,255,0.8);line-height:1.75;">The concept of presence is not simply about visual fidelity but rather about the degree to which the virtual environment responds to the actions of the participant. A high-fidelity environment that does not react to user input will produce lower presence than a lower-fidelity, richly interactive one. <span style="font-style:normal;font-size:var(--micro);color:rgba(165,180,252,0.8);">(p. 431)</span></p>
          </div>
        </div>
        <div style="padding:18px 22px;background:rgba(245,158,11,0.12);border-radius:14px;border:1.5px solid rgba(245,158,11,0.3);">
          <div style="font-size:var(--tiny);font-weight:700;color:#fbbf24;margin-bottom:6px;">📌 Format note</div>
          <div style="font-size:var(--micro);color:rgba(255,255,255,0.6);line-height:1.5;">The author + year introduce the quote (narrative style), then the page number appears in brackets <em>after</em> the final full stop — not before it. This is reversed from short quotes.</div>
        </div>
      </div>
      <div style="flex:0.9;display:flex;flex-direction:column;gap:18px;" class="fu2">
        <div style="font-size:var(--small);font-weight:800;color:#a5b4fc;margin-bottom:4px;">Block Quote Rules</div>
        <ul class="check">
          <li>New paragraph for the quote</li>
          <li>Indent the entire block (0.5 inch / ~1.27 cm)</li>
          <li>No quotation marks</li>
          <li>Page number in brackets after the final stop</li>
          <li>Introduce with a colon or "X argued:" or "According to X (Year):"</li>
        </ul>
        <div style="margin-top:8px;padding:20px 24px;background:rgba(99,102,241,0.15);border-radius:16px;border:1.5px solid rgba(165,180,252,0.25);">
          <div style="font-size:var(--tiny);font-weight:800;color:#a5b4fc;margin-bottom:8px;">Short vs Block at a glance</div>
          <table style="font-size:var(--micro);color:rgba(255,255,255,0.7);border:none;">
            <tr><td style="border:none;padding:5px 12px 5px 0;font-weight:600;color:#a5b4fc;">Under 40 words</td><td style="border:none;padding:5px 0;">Inline, quotation marks, citation before the stop</td></tr>
            <tr><td style="border:none;padding:5px 12px 5px 0;font-weight:600;color:#fbbf24;">40+ words</td><td style="border:none;padding:5px 0;">Indented block, no quotes, citation <em>after</em> the stop</td></tr>
          </table>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"11 Building a Reference Entry",html:`
    <div class="section-label">Reference Construction</div>
    <div class="slide-title">Every Reference Has <span class="accent">Four Parts</span></div>
    <div style="display:flex;flex-direction:column;gap:28px;flex:1;">
      <div class="four-col fu1" style="gap:20px;flex:none;">
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(221,214,254,0.9),rgba(196,181,253,0.5));border:2px solid rgba(124,58,237,0.3);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">👤</div>
          <div style="font-size:var(--body);font-weight:900;color:#4c1d95;">WHO</div>
          <div style="font-size:var(--micro);color:#5b21b6;line-height:1.5;">Last name, Initials.<br/>For multiple: Last, I., &amp; Last, I.</div>
          <div style="background:rgba(124,58,237,0.15);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#4c1d95;font-weight:600;">Slater, M.</div>
        </div>
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(254,243,199,0.95),rgba(253,230,138,0.55));border:2px solid rgba(245,158,11,0.35);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">📅</div>
          <div style="font-size:var(--body);font-weight:900;color:#92400e;">WHEN</div>
          <div style="font-size:var(--micro);color:#78350f;line-height:1.5;">Publication year in brackets.<br/>Use n.d. if no date.</div>
          <div style="background:rgba(245,158,11,0.15);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#92400e;font-weight:600;">(2009).</div>
        </div>
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(204,251,241,0.95),rgba(153,246,228,0.55));border:2px solid rgba(13,148,136,0.35);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">📄</div>
          <div style="font-size:var(--body);font-weight:900;color:#134e4a;">WHAT</div>
          <div style="font-size:var(--micro);color:#0f766e;line-height:1.5;">Title in sentence case.<br/>Book/journal titles in italics.</div>
          <div style="background:rgba(13,148,136,0.15);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#134e4a;font-weight:600;font-style:italic;">Place illusion...</div>
        </div>
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(255,228,230,0.95),rgba(254,205,211,0.55));border:2px solid rgba(225,29,72,0.3);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">🌐</div>
          <div style="font-size:var(--body);font-weight:900;color:#9f1239;">WHERE</div>
          <div style="font-size:var(--micro);color:#be123c;line-height:1.5;">Publisher, journal, DOI, or URL. Always prefer DOI.</div>
          <div style="background:rgba(225,29,72,0.12);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#9f1239;font-weight:600;">https://doi.org/...</div>
        </div>
      </div>
      <div style="padding:28px 36px;background:linear-gradient(135deg,#1e293b,#334155);border-radius:20px;font-family:'Courier New',monospace;font-size:var(--small);line-height:1.85;color:#e2e8f0;" class="fu2">
        <span style="color:#ddd6fe;">Slater, M.</span> <span style="color:#fbbf24;">(2009).</span> <span style="color:#5eead4;">Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments.</span> <span style="color:#f9a8d4;font-style:italic;">Philosophical Transactions of the Royal Society B, 364</span><span style="color:#f9a8d4;">(1535), 3549–3557.</span> <span style="color:#fb923c;">https://doi.org/10.1098/rstb.2009.0138</span>
      </div>
      <div style="display:flex;gap:14px;" class="fu3">
        <div style="flex:1;padding:10px 16px;background:#ddd6fe;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#4c1d95;">👤 WHO</div>
        <div style="flex:0.6;padding:10px 16px;background:#fef3c7;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#92400e;">📅 WHEN</div>
        <div style="flex:2.2;padding:10px 16px;background:#ccfbf1;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#134e4a;">📄 WHAT (title + journal)</div>
        <div style="flex:1.5;padding:10px 16px;background:#ffe4e6;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#9f1239;">🌐 WHERE (DOI)</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"slate-bg",label:"12 Reference Examples: Journal, Book, Webpage",html:`
    <div class="section-label">Reference Templates · Part 1</div>
    <div class="slide-title">Reference <span class="accent">Examples</span></div>
    <div class="three-col fu1" style="gap:26px;flex:1;">
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(224,231,255,0.85),rgba(199,210,254,0.4));border:2px solid rgba(99,102,241,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">📰</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--indigo2);letter-spacing:0.06em;text-transform:uppercase;">Journal Article</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:var(--micro);color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Slater, M.</span> <span style="color:#92400e;">(2009).</span> Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments. <span style="font-style:italic;color:#0f766e;">Philosophical Transactions of the Royal Society B, 364</span>(1535), 3549–3557. <span style="color:#9f1239;">https://doi.org/10.1098/rstb.2009.0138</span>
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Article title: sentence case, no italics</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Journal name: Title Case, italicised</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Always use https://doi.org/ prefix</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(209,250,229,0.85),rgba(167,243,208,0.4));border:2px solid rgba(5,150,105,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">📚</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--green);letter-spacing:0.06em;text-transform:uppercase;">Book</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:var(--micro);color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Sherman, W. R., &amp; Craig, A. B.</span> <span style="color:#92400e;">(2018).</span> <span style="font-style:italic;color:#0f766e;">Understanding virtual reality: Interface, application, and design</span> (2nd ed.). Morgan Kaufmann.
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Book title: italicised, sentence case</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Edition in brackets if not first ed.</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Publisher name only (no location in APA 7)</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(254,243,199,0.85),rgba(253,230,138,0.4));border:2px solid rgba(245,158,11,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">🌐</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--amber2);letter-spacing:0.06em;text-transform:uppercase;">Webpage</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:var(--micro);color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">University of Canterbury.</span> <span style="color:#92400e;">(2023, August 1).</span> <span style="font-style:italic;color:#0f766e;">HIT Lab NZ research overview.</span> https://www.hitlabnz.org
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Include the specific date if shown on page</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Page title in italics, sentence case</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> No "Retrieved from" in APA 7</li>
        </ul>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"",label:"13 Reference Examples: Chapter, Conference, Software",html:`
    <div class="section-label">Reference Templates · Part 2</div>
    <div class="slide-title">More <span class="accent">Reference Types</span></div>
    <div class="three-col fu1" style="gap:26px;flex:1;">
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(237,233,254,0.85),rgba(221,214,254,0.4));border:2px solid rgba(124,58,237,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">📑</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--purple);letter-spacing:0.06em;text-transform:uppercase;">Book Chapter (Edited)</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:19px;color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">McMahan, R. P.</span> <span style="color:#92400e;">(2017).</span> Exploring the effects of higher-fidelity display and interaction. In F. R. Nack &amp; A. S. Gordon (Eds.), <span style="font-style:italic;color:#7c3aed;">Interactive storytelling</span> (pp. 59–68). Springer.
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--purple);">→</span> Chapter author is first; editors after "In"</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--purple);">→</span> Only the <em>book title</em> is italicised</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--purple);">→</span> Page range in (pp. x–x) format</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(204,251,241,0.85),rgba(153,246,228,0.4));border:2px solid rgba(13,148,136,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">🎤</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--teal);letter-spacing:0.06em;text-transform:uppercase;">Conference Paper</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:19px;color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Bowman, D. A., &amp; McMahan, R. P.</span> <span style="color:#92400e;">(2007).</span> Virtual reality: How much immersion is enough? In <span style="font-style:italic;color:#0f766e;">Proceedings of the ACM CHI Conference</span> (pp. 36–43). ACM. https://doi.org/10.1145/xxxxxxx
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Proceedings title italicised (like a book)</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Include publisher (ACM, IEEE, Springer…)</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> DOI strongly preferred over URL</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(224,242,254,0.85),rgba(186,230,253,0.4));border:2px solid rgba(14,165,233,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">💻</span>
          <div style="font-size:var(--tiny);font-weight:800;color:#0284c7;letter-spacing:0.06em;text-transform:uppercase;">Software / App</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:19px;color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Unity Technologies.</span> <span style="color:#92400e;">(2023).</span> <span style="font-style:italic;color:#0369a1;">Unity</span> (Version 2022.3 LTS) [Computer software]. https://unity.com
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:#0284c7;">→</span> Software name italicised</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:#0284c7;">→</span> Version number in regular brackets</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:#0284c7;">→</span> [Computer software] descriptor after title</li>
        </ul>
      </div>
    </div>
    <div class="callout callout-indigo fu2" style="margin-top:20px;">
      <strong>Based on:</strong> American Psychological Association. (2020). <em>Publication manual of the American Psychological Association</em> (7th ed.). https://doi.org/10.1037/0000165-000
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`},{classes:"dark-indigo",label:"14 Five Mistakes to Avoid",html:`
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(225,29,72,0.12) 0%,transparent 70%);right:-80px;top:-100px;"></div>
    <div class="section-label">Common Errors · Click each card to reveal the fix</div>
    <div class="slide-title">Five <span class="accent">Mistakes</span> to Avoid</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:18px;flex:1;">
      <div class="mistake-card fu1" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">🔀</div>
        <div class="mistake-title">Confusing et al. when names clash</div>
        <div class="fix">Two papers share first authors + year. APA says write enough names to distinguish them — then et al. Don't assume the first name is enough.</div>
      </div>
      <div class="mistake-card fu2" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">👻</div>
        <div class="mistake-title">Using ibid. or op. cit.</div>
        <div class="fix">These footnote shorthand terms belong to Chicago/Oxford style. APA never uses them. Ever. Just repeat the full author–year citation each time.</div>
      </div>
      <div class="mistake-card fu3" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">👁️</div>
        <div class="mistake-title">Citing only the abstract</div>
        <div class="fix">If you only read the abstract, you only read part of the paper. Don't cite findings from sections you haven't read. Read the paper. Then cite it.</div>
      </div>
      <div class="mistake-card fu4" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">📋</div>
        <div class="mistake-title">Padding the reference list</div>
        <div class="fix">APA reference list = only sources cited in the text. Nothing extra. A bibliography includes background reading — APA doesn't. Remove anything you didn't cite.</div>
      </div>
      <div class="mistake-card fu5" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">🔗</div>
        <div class="mistake-title">Missing DOIs / using raw URLs</div>
        <div class="fix">Always search for a DOI before using a plain URL. DOIs are permanent — URLs rot. Always prefix: https://doi.org/ not dx.doi.org or just the number.</div>
      </div>
    </div>
    <div style="margin-top:20px;padding:16px 24px;background:rgba(165,180,252,0.12);border-radius:14px;border:1.5px solid rgba(165,180,252,0.25);" class="fu6">
      <p style="font-size:var(--tiny);color:rgba(255,255,255,0.55);text-align:center;">📚 Reference: American Psychological Association. (2020). <em>Publication manual of the APA</em> (7th ed.) · Scroll to the quiz below to test your knowledge</p>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`}],_=[{q:"In APA 7, how do you cite a source with 3 or more authors for the very first time?",options:["Write all author names in full","First author + et al., from the first citation","Write first 3 names, then et al.","Write only the first author's last name"],correct:1,explain:"APA 7 changed this from APA 6: use et al. from the very first citation for 3+ authors. APA 6 required all names up to 5 authors on first mention."},{q:'What does "n.d." stand for in a citation like (Smith, n.d.)?',options:["Not documented","No date","Not determined","No digital copy"],correct:1,explain:'n.d. stands for "no date" — used when a source has no identifiable publication date. Common for some websites and unpublished works.'},{q:"What is the minimum word count that triggers a block quote in APA 7?",options:["25 words","30 words","40 words","50 words"],correct:2,explain:"40 or more words = block quote. Format: new paragraph, indented, no quotation marks, citation after the full stop."},{q:"Which is the correct APA 7 in-text format for two authors?",options:["(Brown and Jones, 2021)","(Brown & Jones, 2021)","(Brown, Jones, 2021)","(Brown-Jones, 2021)"],correct:1,explain:'Two authors use an ampersand (&) inside brackets. When authors are part of the narrative sentence, use "and" — e.g., Brown and Jones (2021).'},{q:"In what order do you arrange the APA 7 reference list?",options:["By year (newest first)","Alphabetically by first author's surname","Order of first appearance in text","By type (books before articles)"],correct:1,explain:"APA reference lists are always alphabetical by the first author's surname. Same-author entries are then sorted by year, oldest first."},{q:"Which DOI format is correct in APA 7?",options:["doi:10.1234/example","dx.doi.org/10.1234/example","https://doi.org/10.1234/example","10.1234/example"],correct:2,explain:"Always use https://doi.org/ as the prefix. The older dx.doi.org format is no longer recommended, and a bare number is incomplete."},{q:"Which title capitalisation is correct for a journal ARTICLE in APA 7?",options:['"The Role of Presence in Virtual Reality" (Title Case)','"The role of presence in virtual reality" (Sentence case)','"THE ROLE OF PRESENCE IN VIRTUAL REALITY" (ALL CAPS)','"the role of presence in virtual reality" (all lowercase)'],correct:1,explain:"Article titles use sentence case: only the first word, proper nouns, and the first word after a colon are capitalised. Journal names stay in Title Case and are italicised."},{q:"A paper has 5 reference list entries that are never cited in the text. What is the issue?",options:["Nothing — APA uses bibliographies this way","APA reference lists must only contain sources actually cited in the text","The paper needs more in-text citations for each entry","The reference list is too long; remove all 5"],correct:1,explain:`An APA reference list ≠ bibliography. Only sources you actually cited go in the reference list. Remove anything uncited — it's not a "further reading" list.`}];function si(){const[t,r]=a.useState(Array(_.length).fill(null)),[o,h]=a.useState(!1),[s,w]=a.useState(0),A=o?t.filter((d,l)=>d===_[l].correct).length:0,N=Math.round(A/_.length*100);function z(){r(Array(_.length).fill(null)),h(!1),w(0)}const M=_[s],S=t[s]!==null,D=S&&t[s]===M.correct,f=t.every(d=>d!==null);function g(d){if(o)return;const l=[...t];l[s]=d,r(l)}return e.jsxs("div",{className:"rounded-2xl overflow-hidden",style:{border:"2px solid rgba(67,56,202,0.2)",background:"rgba(255,255,255,0.9)"},children:[e.jsxs("div",{className:"px-6 py-4 flex items-center justify-between",style:{background:"linear-gradient(135deg, #1e1b4b, #3730a3)"},children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-widest",style:{color:"#a5b4fc"},children:"Knowledge Check"}),e.jsx("h3",{className:"text-base font-bold text-white mt-0.5",children:"APA 7 Citation Quiz"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("span",{className:"text-xs font-semibold px-3 py-1 rounded-full",style:{background:"rgba(165,180,252,0.2)",color:"#a5b4fc"},children:[s+1," / ",_.length]}),o&&e.jsxs("button",{onClick:z,className:"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80",style:{background:"rgba(165,180,252,0.2)",color:"#a5b4fc"},children:[e.jsx(Pe,{size:12})," Retry"]})]})]}),e.jsx("div",{style:{height:4,background:"rgba(67,56,202,0.1)"},children:e.jsx("div",{style:{width:`${(s+1)/_.length*100}%`,height:"100%",background:"linear-gradient(90deg, #4338ca, #6366f1)",transition:"width 0.3s ease",borderRadius:"0 2px 2px 0"}})}),o?e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("div",{className:"text-5xl mb-3",children:N>=90?"🏆":N>=70?"🎉":N>=50?"📚":"💪"}),e.jsxs("div",{className:"text-3xl font-black mb-1",style:{color:"#1e1b4b"},children:[A,"/",_.length]}),e.jsxs("div",{className:"text-sm font-semibold",style:{color:N>=70?"#059669":"#d97706"},children:[N,"% correct"]}),e.jsx("p",{className:"text-xs mt-2",style:{color:"#6b7280"},children:N===100?"Perfect! You have mastered APA 7 citations.":N>=70?"Great work — a couple of areas to review.":"Go back through the slides and try again."})]}),e.jsx("div",{className:"flex flex-col gap-3",children:_.map((d,l)=>{const c=t[l],b=c===d.correct;return e.jsx("div",{className:"rounded-xl p-4",style:{background:b?"rgba(5,150,105,0.07)":"rgba(225,29,72,0.07)",border:`1.5px solid ${b?"rgba(5,150,105,0.2)":"rgba(225,29,72,0.2)"}`},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"flex-shrink-0 mt-0.5",children:b?e.jsx(pt,{size:16,style:{color:"#059669"}}):e.jsx(Le,{size:16,style:{color:"#e11d48"}})}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs font-semibold mb-1",style:{color:"#1e293b"},children:["Q",l+1,": ",d.q]}),!b&&e.jsxs("p",{className:"text-xs mb-1",style:{color:"#e11d48"},children:["Your answer: ",d.options[c]]}),e.jsxs("p",{className:"text-xs font-semibold mb-1",style:{color:"#059669"},children:["✓ ",d.options[d.correct]]}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:d.explain})]})]})},l)})})]}):e.jsxs("div",{className:"p-6",children:[e.jsx("p",{className:"text-sm font-semibold mb-4 leading-relaxed",style:{color:"#1e1b4b"},children:M.q}),e.jsx("div",{className:"flex flex-col gap-2 mb-5",children:M.options.map((d,l)=>{const c=t[s]===l,b=o&&l===M.correct,v=o&&c&&!b;return e.jsxs("button",{onClick:()=>g(l),disabled:o,className:"text-left px-4 py-3 rounded-xl text-xs font-medium transition-all",style:{background:b?"rgba(5,150,105,0.12)":v?"rgba(225,29,72,0.1)":c?"rgba(67,56,202,0.1)":"rgba(248,250,252,0.9)",border:`1.5px solid ${b?"rgba(5,150,105,0.4)":v?"rgba(225,29,72,0.35)":c?"rgba(67,56,202,0.35)":"rgba(226,232,240,0.8)"}`,color:b?"#065f46":v?"#9f1239":c?"#1e1b4b":"#374151",cursor:o?"default":"pointer"},children:[e.jsxs("span",{className:"font-bold mr-2",style:{color:b?"#059669":v?"#e11d48":c?"#4338ca":"#9ca3af"},children:[String.fromCharCode(65+l),"."]}),d]},l)})}),S&&!o&&e.jsxs("div",{className:"rounded-xl px-4 py-3 mb-4",style:{background:D?"rgba(5,150,105,0.08)":"rgba(225,29,72,0.08)",border:`1.5px solid ${D?"rgba(5,150,105,0.25)":"rgba(225,29,72,0.25)"}`},children:[e.jsx("p",{className:"text-xs font-bold mb-1",style:{color:D?"#059669":"#e11d48"},children:D?"✓ Correct!":"✗ Not quite."}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:M.explain})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("button",{onClick:()=>w(d=>Math.max(0,d-1)),disabled:s===0,className:"text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-30",style:{background:"rgba(67,56,202,0.08)",color:"#4338ca"},children:"← Previous"}),e.jsx("div",{className:"flex gap-1.5",children:_.map((d,l)=>e.jsx("button",{onClick:()=>w(l),className:"rounded-full transition-all",style:{width:l===s?20:8,height:8,background:t[l]!==null?o&&t[l]===_[l].correct?"#059669":o?"#e11d48":"#4338ca":l===s?"#4338ca":"rgba(67,56,202,0.2)"}},l))}),s<_.length-1?e.jsx("button",{onClick:()=>w(d=>d+1),className:"text-xs font-semibold px-4 py-2 rounded-xl transition-all",style:{background:"rgba(67,56,202,0.08)",color:"#4338ca"},children:"Next →"}):e.jsx("button",{onClick:()=>h(!0),disabled:!f,className:"text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-40",style:{background:f?"#4338ca":"rgba(67,56,202,0.15)",color:f?"#fff":"#4338ca"},children:"Submit Quiz"})]})]})]})}function ii(){const[t,r]=a.useState(!1),[o,h]=a.useState(""),[s,w]=a.useState(!1),[A,N]=a.useState(!1);a.useEffect(()=>{sessionStorage.getItem(Nt)==="true"&&r(!0)},[]);function z(k){k.preventDefault(),o.trim().toUpperCase()==="APAV7"?(sessionStorage.setItem(Nt,"true"),r(!0),w(!1)):(w(!0),h(""))}const[M,S]=a.useState(0),[D,f]=a.useState(!1),[g,d]=a.useState(!1),l=a.useRef(null),c=a.useRef(null),b=it.length;a.useEffect(()=>{const k="apa-deck-styles";if(!document.getElementById(k)){const n=document.createElement("style");n.id=k,n.textContent=ti,document.head.appendChild(n)}return()=>{const n=document.getElementById(k);n&&n.remove()}},[]),a.useEffect(()=>{const k=l.current,n=c.current;if(!k||!n)return;const i=new ResizeObserver(()=>{const{width:u}=k.getBoundingClientRect(),C=u/1920;n.style.transform=`scale(${C})`,n.style.transformOrigin="top left",k.style.height=`${1080*C}px`});return i.observe(k),()=>i.disconnect()},[]),a.useEffect(()=>{const k=n=>{(n.key==="ArrowRight"||n.key==="ArrowDown")&&S(i=>Math.min(i+1,b-1)),(n.key==="ArrowLeft"||n.key==="ArrowUp")&&S(i=>Math.max(i-1,0)),n.key==="Escape"&&g&&E()};return window.addEventListener("keydown",k),()=>window.removeEventListener("keydown",k)},[g,b]),a.useEffect(()=>{const k=()=>d(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",k),()=>document.removeEventListener("fullscreenchange",k)},[]);function v(){l.current?.requestFullscreen?.()}function E(){document.exitFullscreen?.()}const R=it[M],m="#4338ca";return t?e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>S(k=>Math.max(k-1,0)),disabled:M===0,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:`${m}40`},children:e.jsx(le,{size:18})}),e.jsxs("span",{className:"text-sm font-medium text-gray-600 min-w-[80px] text-center",children:[M+1," / ",b]}),e.jsx("button",{onClick:()=>S(k=>Math.min(k+1,b-1)),disabled:M===b-1,className:"p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50",style:{borderColor:`${m}40`},children:e.jsx(X,{size:18})})]}),e.jsx("span",{className:"text-xs font-medium text-gray-400 hidden sm:block",children:R.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>f(k=>!k),className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:`${m}40`},title:D?"Collapse":"Expand",children:D?e.jsx(ie,{size:16}):e.jsx(ae,{size:16})}),e.jsx("button",{onClick:g?E:v,className:"p-1.5 rounded-lg border transition-colors hover:bg-gray-50",style:{borderColor:`${m}40`},title:g?"Exit fullscreen":"Fullscreen",children:g?e.jsx(oe,{size:16}):e.jsx(re,{size:16})})]})]}),e.jsx("div",{ref:l,className:"apa relative w-full overflow-hidden rounded-xl",style:{border:`1px solid ${m}30`},children:e.jsx("div",{ref:c,style:{width:1920,height:1080},children:e.jsx("section",{className:R.classes,dangerouslySetInnerHTML:{__html:R.html}})})}),e.jsx("div",{className:`flex flex-wrap justify-center gap-1.5 ${D?"mt-2":""}`,children:it.map((k,n)=>e.jsx("button",{onClick:()=>S(n),title:k.label,className:"rounded-full transition-all",style:{width:n===M?24:8,height:8,background:n===M?m:`${m}30`}},n))}),e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"mb-3 px-1",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-widest",style:{color:"#9ca3af"},children:"After the Slides"}),e.jsx("h3",{className:"text-base font-bold mt-1",style:{color:"#1e1b4b"},children:"Test Your APA 7 Knowledge"}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:"#6b7280"},children:"8 questions · Click through each question · Instant feedback · No data stored"})]}),e.jsx(si,{})]})]}):e.jsx("div",{className:"flex flex-col items-center justify-center py-12 px-6",children:e.jsxs("div",{className:"w-full max-w-sm rounded-2xl overflow-hidden",style:{border:"2px solid rgba(67,56,202,0.2)",background:"rgba(255,255,255,0.95)"},children:[e.jsxs("div",{className:"px-6 py-5 text-center",style:{background:"linear-gradient(135deg, #1e1b4b, #3730a3)"},children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3",style:{background:"rgba(165,180,252,0.15)",border:"2px solid rgba(165,180,252,0.3)"},children:e.jsx(he,{size:26,style:{color:"#a5b4fc"}})}),e.jsx("h3",{className:"text-base font-bold text-white",children:"Password Required"}),e.jsx("p",{className:"text-xs mt-1",style:{color:"rgba(255,255,255,0.55)"},children:"APA v7 Citations: The Crash Course"})]}),e.jsxs("form",{onSubmit:z,className:"p-6 flex flex-col gap-4",children:[e.jsx("p",{className:"text-xs text-center",style:{color:"#6b7280"},children:"This resource is password-protected. Enter the access password provided by your lecturer."}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:A?"text":"password",value:o,onChange:k=>{h(k.target.value),w(!1)},placeholder:"Enter password",autoFocus:!0,className:"w-full px-4 py-3 rounded-xl text-sm font-semibold tracking-widest outline-none transition-all",style:{border:`2px solid ${s?"rgba(225,29,72,0.5)":"rgba(67,56,202,0.2)"}`,background:s?"rgba(255,228,230,0.5)":"rgba(238,242,255,0.6)",color:"#1e1b4b",paddingRight:"44px"}}),e.jsx("button",{type:"button",onClick:()=>N(k=>!k),className:"absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-70",style:{color:"#9ca3af"},children:A?e.jsx(Dt,{size:16}):e.jsx(xt,{size:16})})]}),s&&e.jsx("p",{className:"text-xs text-center font-semibold",style:{color:"#e11d48"},children:"Incorrect password — please try again."}),e.jsx("button",{type:"submit",className:"w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95",style:{background:"linear-gradient(135deg, #4338ca, #6366f1)",color:"#fff"},children:"Unlock Lesson"})]})]})})}const ai=[{num:1,title:"Introduction to DBMS",sub:"Foundations & MySQL Environment Setup",topics:["Data vs. Information","DBMS vs. file-based systems","MySQL installation & first connection"],methods:["Think-Pair-Share","Kahoot!","Live Demo","Exit Ticket"],accent:"#1e40af",lightBg:"rgba(219,234,254,0.45)",lightBorder:"rgba(59,130,246,0.22)"},{num:2,title:"SQL Programming Fundamentals",sub:"DDL Commands, Data Types & Basic Data Retrieval",topics:["CREATE DATABASE & CREATE TABLE","Data types and constraints","INSERT INTO & SELECT basics"],methods:["Live Coding","Pair Programming","Scaffolded Learning"],accent:"#065f46",lightBg:"rgba(209,250,229,0.45)",lightBorder:"rgba(16,185,129,0.22)"},{num:3,title:"Advanced SQL Queries",sub:"Filtering, Aggregations, JOINs & DML Operations",topics:["WHERE, ORDER BY, LIMIT, OFFSET","COUNT, SUM, AVG, MAX, MIN, GROUP BY","UPDATE, DELETE, INNER JOIN"],methods:["Query Olympics","Jigsaw Activity","Retrieval Practice"],accent:"#6d28d9",lightBg:"rgba(237,233,254,0.45)",lightBorder:"rgba(124,58,237,0.22)"},{num:4,title:"ER Diagrams — Foundations",sub:"Chen's Notation, Entities, Attributes & Cardinality",topics:["Chen's notation symbols","Attribute types & cardinality (1:1, 1:N, M:N)","Group design challenge + Gallery Walk"],methods:["Gallery Walk","Socratic Method","Collaborative Design"],accent:"#92400e",lightBg:"rgba(254,243,199,0.45)",lightBorder:"rgba(245,158,11,0.22)"},{num:5,title:"Advanced ER Concepts",sub:"Weak Entities, Special Attributes & Participation Constraints",topics:["Weak entities & identifying relationships","Composite, multivalued & derived attributes","Total vs. partial participation"],methods:["Case-Based Learning","Annotation Activity","Peer Teaching"],accent:"#0e7490",lightBg:"rgba(207,250,254,0.45)",lightBorder:"rgba(8,145,178,0.22)"},{num:6,title:"ER to Relational Mapping",sub:"8 Mapping Rules — Conceptual Design to SQL Schema",topics:["Rules 1–4: strong entity, weak entity, 1:1, 1:N","Rules 5–8: M:N, multivalued, ternary, composite","Peer assessment with 8-rule checklist"],methods:["Worked Examples","Peer Assessment","Jigsaw Rules"],accent:"#9f1239",lightBg:"rgba(255,241,242,0.55)",lightBorder:"rgba(225,29,72,0.18)"},{num:7,title:"Database Normalization",sub:"Functional Dependencies, 1NF, 2NF, 3NF & BCNF",topics:["Insertion, deletion & update anomalies","Functional, partial & transitive dependencies","1NF → 2NF → 3NF → BCNF steps"],methods:["Discovery Learning","Socratic Seminar","Scaffolded Practice"],accent:"#1e3a8a",lightBg:"rgba(239,246,255,0.6)",lightBorder:"rgba(30,58,138,0.18)"},{num:8,title:"SQL Practice Lab & Final Assessment",sub:"Integrated Lab · DBMS Knowledge Check · Certifications",topics:["SQL Practice Lab — 10 personalised scenarios","DBMS Knowledge Check (38 MCQ, 60% pass)","Certification pathways + course reflection"],methods:["Project-Based","Peer Code Review","Reflective Practice"],accent:"#374151",lightBg:"rgba(249,250,251,0.7)",lightBorder:"rgba(107,114,128,0.2)"}],at="/thisisnotalms/".replace(/\/$/,"");function oi(){const t=o=>{window.open(`${at}/lesson-plans/class-${o}.html`,"_blank")},r=o=>{window.open(`${at}/lesson-plans/class-${o}.html?pdf=1`,"_blank")};return e.jsxs("section",{className:"mt-8",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx(V,{size:22,style:{color:"#6d28d9"}}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-bold",style:{color:"#1e1b4b"},children:"Lesson Plans"}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:"8 classes · 10:40 AM – 1:00 PM · 120 min teaching + 20 min break"})]})]}),e.jsxs("div",{className:"inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5",style:{background:"rgba(109,40,217,0.09)",border:"1px solid rgba(109,40,217,0.22)"},children:[e.jsx(he,{size:11,style:{color:"#6d28d9"}}),e.jsx("span",{className:"text-xs font-semibold",style:{color:"#6d28d9"},children:"Visible to lecturers & teaching assistants only"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:ai.map(o=>e.jsxs("div",{className:"card overflow-hidden",style:{border:`1px solid ${o.lightBorder}`},children:[e.jsxs("div",{className:"px-5 py-3 flex items-center gap-3",style:{background:o.lightBg,borderBottom:`1px solid ${o.lightBorder}`},children:[e.jsx("div",{className:"w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0",style:{background:o.accent},children:o.num}),e.jsxs("div",{className:"min-w-0",children:[e.jsxs("div",{className:"text-xs font-semibold uppercase tracking-wider mb-0.5",style:{color:o.accent},children:["Class ",o.num," of 8"]}),e.jsx("div",{className:"font-bold text-sm leading-tight",style:{color:"#1e1b4b"},children:o.title}),e.jsx("div",{className:"text-xs mt-0.5",style:{color:"#6b7280"},children:o.sub})]})]}),e.jsxs("div",{className:"px-5 py-4",children:[e.jsx("ul",{className:"space-y-1.5 mb-4",children:o.topics.map(h=>e.jsxs("li",{className:"flex items-start gap-2 text-xs",style:{color:"#374151"},children:[e.jsx("span",{className:"mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0",style:{background:o.accent}}),h]},h))}),e.jsx("div",{className:"flex flex-wrap gap-1.5 mb-4",children:o.methods.map(h=>e.jsx("span",{className:"text-xs font-medium px-2 py-0.5 rounded-full",style:{background:`${o.lightBg}`,border:`1px solid ${o.lightBorder}`,color:o.accent},children:h},h))}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("span",{className:"flex items-center gap-1 text-xs",style:{color:"#9ca3af"},children:[e.jsx(Kt,{size:11}),"10:40 – 1:00 PM"]}),e.jsx("div",{className:"flex-1"}),e.jsxs("button",{onClick:()=>t(o.num),className:"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",style:{background:o.lightBg,border:`1px solid ${o.lightBorder}`,color:o.accent},children:[e.jsx(xt,{size:13}),"View"]}),e.jsxs("button",{onClick:()=>r(o.num),className:"flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90",style:{background:o.accent},children:[e.jsx(Gt,{size:13}),"Download PDF"]})]})]})]},o.num))}),e.jsx("div",{className:"mt-4 text-center",children:e.jsxs("button",{onClick:()=>window.open(`${at}/lesson-plans/index.html`,"_blank"),className:"inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 transition-all hover:opacity-90",style:{background:"linear-gradient(135deg, #1e1b4b, #4c1d95)",color:"white"},children:[e.jsx(V,{size:15}),"Open Full Lesson Plans Overview"]})})]})}let We=null;const ee="/thisisnotalms/",ri=[{title:"Advanced ER Activities – Introduction",description:"Introductory Video for the Adcanced ER Diagram Activities",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCRe7UEzG6kS7qnD0YIKL26AXyVXup4iuZNvCtm-H_bWM0?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=YwGTJM",thumbnailUrl:`${ee}Intro.png`},{title:"Advanced ER – Activity 1 Answer",description:"Discussion for the Activity 1",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCWj89h_cAfR5PdPJKJ6n6FAXxIUVcLFYr_ZWS9C2Z6jB4?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=KSzPeg",thumbnailUrl:`${ee}Activity1.png`},{title:"Advanced ER – Activity 2 Answer",description:"Discussion for the Activity 2",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQDIM1P8eEAGSJ40okuBoQIjAQWu9LRaOkyerxnAQSwuyps?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=OjX2gq",thumbnailUrl:`${ee}Activity2.png`},{title:"Advanced ER – Activity 3 Answer",description:"Discussion for the Activity 3",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQD5DSbZ-mhTTaozgGbU3wPxAe4p7vmen4W4ugIUFGPsBLY?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=DQzH0y",thumbnailUrl:`${ee}Activity3.png`},{title:"Advanced ER – Activity 4 Answer",description:"Discussion for the Activity 4",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQD5DSbZ-mhTTaozgGbU3wPxAe4p7vmen4W4ugIUFGPsBLY?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=sLu72l",thumbnailUrl:`${ee}Activity4.png`},{title:"Advanced ER – Activity 5 Answer",description:"Discussion for the Activity 5",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCckQ8T7ucbT5G_5j-94JV8Aei2NKaqfnJQIaQ_30vBWDg?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=0HJNTl",thumbnailUrl:`${ee}Activity5.png`}],li=[{title:"Normalization – Introduction",description:"Introductory video for Database Normalization & Functional Dependencies",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQAowdJDkOhQTq1zdGLQEhuVAVOSCBFxoYfC_6R_udOvPx8?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=tDjwog",thumbnailUrl:`${ee}NormIntro.png`},{title:"Normalization – Why Normalise?",description:"Understanding the need for database normalization",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQB8pA9SvlmuQ7FBkSDvkwuAAabog23pf1imS32sfOJWjnU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=y0Xrms",thumbnailUrl:`${ee}NormWhy.png`},{title:"Normalization – Functional Dependencies",description:"Introduction to functional dependencies in relational databases",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQBJVg0hKdB1SZJcHC2qHBxcASVGMpngLuFNOcPSWisP73Q?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=3AOjNd",thumbnailUrl:`${ee}NormFD.png`},{title:"Normalization – First Normal Form (1NF)",description:"Understanding and applying First Normal Form",url:"https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQDwiXe1GAG4QornPClJYm6PAej3l8tqwmUvRsE9xRboIsA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=INiQAM",thumbnailUrl:`${ee}Norm1NF.png`}],ot=[{id:"MBI800",name:"MBI800",tagline:"Business Information Systems",accentColor:"#0ea5e9",bgGradient:"linear-gradient(135deg, rgba(14,165,233,0.08), rgba(56,189,248,0.04))",lessons:[{id:"sisp-lab",title:"SISP Prompt Engineering Lab",subtitle:"5 scenario-based challenges · AI-evaluated · Covers Iceberg Model, Process Dimensions, Participation, Consistency & Methodology",icon:e.jsx(Ue,{size:18}),accentColor:"#0ea5e9"}]},{id:"MBI802",name:"MBI802",tagline:"Database Management Systems",accentColor:"#7c3aed",bgGradient:"linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.04))",lessons:[{id:"setup",title:"MySQL Development Environment Setup",subtitle:"Video tutorials for MacOS and Windows installation",icon:e.jsx(Zt,{size:18}),accentColor:"#7c3aed"},{id:"slides",title:"SQL Programming Slides",subtitle:"13-slide interactive deck covering basic MySQL commands",icon:e.jsx(Vt,{size:18}),accentColor:"#2563eb"},{id:"er",title:"ER Diagrams Basics",subtitle:"24-slide deck · Chen's notation · entities, attributes, relationships & cardinality",icon:e.jsx(Ge,{size:18}),accentColor:"#0d7a72"},{id:"er-activities",title:"ER Diagram Activities",subtitle:"12-slide activity deck · 5 real-world scenarios · Library, University, Hospital, Online Store, Hotel",icon:e.jsx(Ue,{size:18}),accentColor:"#1d4ed8"},{id:"er-advanced",title:"Advanced ER Concepts",subtitle:"11-slide deck · Weak entities, identifying relationships, multivalued & derived attributes · 2 exercises",icon:e.jsx(V,{size:18}),accentColor:"#3b82f6"},{id:"er-attr-constraints",title:"Composite Attributes & Participation Constraints",subtitle:"20-slide deck · Composite attributes, participation constraints · 2 activities with answers",icon:e.jsx(Ge,{size:18}),accentColor:"#0f766e"},{id:"er-mapping",title:"ER to Relational Schema Mapping",subtitle:"23-slide deck · 8 mapping rules · Worked example · Activity with answer",icon:e.jsx(V,{size:18}),accentColor:"#7c3aed"},{id:"er-mcq",title:"ER Knowledge Check",subtitle:"20 questions · 3 attempts · Score >50% to unlock remaining lessons · 90%+ on first attempt earns a badge",icon:e.jsx(Qe,{size:18}),accentColor:"#6366f1"},{id:"normalization",title:"Database Normalization & Functional Dependencies",subtitle:"20-slide deck · 1NF, 2NF, 3NF, BCNF · Functional dependencies · Decomposition · 3 activities",icon:e.jsx(V,{size:18}),accentColor:"#6366f1"},{id:"quiz",title:"DBMS Knowledge Check",subtitle:"38 questions · No time limit · Unlimited attempts",icon:e.jsx(Qe,{size:18}),accentColor:"#059669"},{id:"sql-practice",title:"SQL Practice Lab",subtitle:"Hands-on SQL activity · Personalised scenario · Create database, table, insert & retrieve data · TA-verified",icon:e.jsx(Ue,{size:18}),accentColor:"#7c3aed"},{id:"free-mysql-certs",title:"Free MySQL / SQL / Database Design Certifications",subtitle:"Nine genuinely free credentials — vendor badges, skill certifications & course completion certificates · Boost your CV and LinkedIn profile",icon:e.jsx(Se,{size:18}),accentColor:"#6d28d9"}]},{id:"MBI804",name:"MBI804",tagline:"IT Project Management",accentColor:"#059669",bgGradient:"linear-gradient(135deg, rgba(5,150,105,0.08), rgba(52,211,153,0.04))",lessons:[{id:"agile-scrum",title:"Agile Scrum Process in IT",subtitle:"22-slide interactive deck · Roles, Artifacts, Events, Sprint Cycle, User Stories & Scrum Board",icon:e.jsx(Ge,{size:18}),accentColor:"#059669"},{id:"agile-scrum-mcq",title:"Agile Scrum Knowledge Check",subtitle:"30 multiple-choice questions · 3 attempts · Score ≥90% on first attempt to earn a badge",icon:e.jsx(Qe,{size:18}),accentColor:"#0d9488"},{id:"free-agile-certs",title:"Free Agile & Scrum Certifications",subtitle:"Four no-cost options where both the course and the completion certificate are free · Recommended to complement your Agile Scrum coursework",icon:e.jsx(Se,{size:18}),accentColor:"#059669"}]},{id:"GENERAL",name:"GENERAL",tagline:"General Resources for All Students",accentColor:"#4338ca",bgGradient:"linear-gradient(135deg, rgba(67,56,202,0.08), rgba(99,102,241,0.04))",alwaysVisible:!0,lessons:[{id:"apa-referencing",title:"APA 7 Citations: The Crash Course",subtitle:"14-slide interactive deck · In-text citations, reference types, common mistakes · Includes a practice quiz",icon:e.jsx(V,{size:18}),accentColor:"#4338ca"}]}];function ni(){return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider",style:{color:"#8b5cf6"},children:"Post"}),e.jsx("h3",{className:"text-lg font-bold mt-1",style:{color:"#1e1b4b"},children:"MySQL Development Environment Setup Video Tutorials"}),e.jsx("p",{className:"text-sm mt-3",style:{color:"#4b5563"},children:"Dear students, Ayubowan!"}),e.jsxs("p",{className:"text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",style:{color:"#6d28d9",background:"rgba(221,214,254,0.55)"},children:[e.jsx(Oe,{size:12})," Author: MBI802 Lecturer"]})]}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:"I have created two video tutorials to help you set up MySQL on your Windows or Mac computer. Please try the installation on your own. You will also have time in class next week to set it up with support."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(219,234,254,0.85), rgba(186,230,253,0.7))",borderColor:"rgba(59,130,246,0.18)"},children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",style:{color:"#1d4ed8"},children:[e.jsx(Jt,{size:16})," MacOS Setup Path"]}),e.jsx("p",{className:"text-xs mt-2",style:{color:"#1e3a8a"},children:"Recommended for MacBook and iMac users. Follow this first before class support time."})]}),e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(237,233,254,0.9), rgba(224,231,255,0.75))",borderColor:"rgba(124,58,237,0.20)"},children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",style:{color:"#6d28d9"},children:[e.jsx($t,{size:16})," Windows Setup Path"]}),e.jsx("p",{className:"text-xs mt-2",style:{color:"#4c1d95"},children:"Best for Windows laptops and desktops. Keep screenshots ready if any installer error appears."})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:[e.jsx("a",{href:"https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAdgK7LxBsxQ4OpdEwrXl17AX3mZyaMmmlXdA3xw4jSvcs?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=Ebi4ee",target:"_blank",rel:"noreferrer",className:"p-4 rounded-2xl border hover:border-violet-300 transition-all",style:{borderColor:"rgba(139,92,246,0.18)",background:"rgba(245,243,255,0.6)"},children:e.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",style:{color:"#5b21b6"},children:[e.jsx(Xt,{size:16})," MacOS Guide Video ",e.jsx(ce,{size:14})]})}),e.jsx("a",{href:"https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAGNda_bc72R55878wdYxfRAbAKGBetSMR65xdEWdQO3ZU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=wTx1An",target:"_blank",rel:"noreferrer",className:"p-4 rounded-2xl border hover:border-violet-300 transition-all",style:{borderColor:"rgba(139,92,246,0.18)",background:"rgba(245,243,255,0.6)"},children:e.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",style:{color:"#5b21b6"},children:[e.jsx(es,{size:16})," Windows Guide Video ",e.jsx(ce,{size:14})]})})]}),e.jsxs("p",{className:"text-sm leading-6",style:{color:"#374151"},children:["Some of you may see a popup asking to install Visual C++. If that happens, simply download the recommended file that appears on your screen, or use this link:"," ",e.jsx("a",{href:"https://aka.ms/vs/17/release/vc_redist.x64.exe",target:"_blank",rel:"noreferrer",className:"font-semibold",style:{color:"#6d28d9"},children:"Visual C++ Redistributable"}),"."]}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:"Different computers can show different errors depending on the software versions you have. One full hour has been set aside in the next class for one-to-one in-person help from your teaching assistants. If you run into any issues, take screenshots and bring them to class."}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:"Please avoid posting errors here, since there are more than one hundred students and it becomes difficult to manage. Comments and suggestions are welcome, especially if you would like more video tutorials."}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:"If your issue is still not solved by the end of the next class, a Google Form will be shared where you can submit your details. This is exactly why the database setup started early, so there is no pressure at all."}),e.jsx("p",{className:"text-sm font-semibold",style:{color:"#4c1d95"},children:"Happy learning!"})]})}function di(){return e.jsx(cs,{})}function ci({studentProfile:t,isStaff:r}){return e.jsxs("div",{className:"space-y-4",children:[!r&&e.jsxs("div",{className:"flex items-start gap-3 rounded-2xl px-4 py-3 border",style:{background:"linear-gradient(135deg, rgba(254,243,199,0.95), rgba(253,230,138,0.6))",borderColor:"rgba(245,158,11,0.35)"},children:[e.jsx(Ue,{size:18,style:{color:"#d97706",flexShrink:0,marginTop:2}}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-bold",style:{color:"#92400e"},children:"Try this only if you have your MySQL setup ready!"}),e.jsx("p",{className:"text-xs mt-0.5 leading-5",style:{color:"#78350f"},children:"These questions are designed for students who have already completed the MySQL installation. If your setup is still in progress, finish the setup first — come back to this quiz once you are ready. The quiz covers Database Management System theory and real-world scenarios, not SQL coding."})]})]}),r?e.jsx(rs,{}):e.jsx(os,{studentProfile:t})]})}function pi(){const t=[{badge:"MySQL Badge",badgeBg:"rgba(204,7,30,0.10)",badgeColor:"#991b1b",title:"Oracle MyLearn — MySQL Explorer",tag:"VENDOR BADGE · BEGINNER · ≈5–7 hrs",tagColor:"#b91c1c",description:'The most credible free MySQL credential available — issued directly by Oracle, the company that owns MySQL. Complete the self-paced learning path covering the client/server model, MySQL Workbench, basic and complex queries, and troubleshooting. Earn an official "MySQL Explorer" digital badge from Oracle after passing a free online assessment. Free Oracle account only; no credit card.',linkLabel:"mylearn.oracle.com",href:"https://mylearn.oracle.com/ou/learning-path/mysql-explorer/79674",cardBg:"linear-gradient(135deg, rgba(254,226,226,0.80), rgba(252,165,165,0.38))",borderColor:"rgba(239,68,68,0.20)",accentColor:"#dc2626"},{badge:"Verified Cert",badgeBg:"rgba(5,150,105,0.10)",badgeColor:"#064e3b",title:"HackerRank — SQL (Basic) Skills Certification",tag:"SKILL EXAM · BEGINNER · 30 min",tagColor:"#059669",description:"A 30-minute online assessment — no course required, just study and sit it. Tests simple queries, relationships, and aggregators on relational databases including MySQL. You earn a verified Skills Certificate with a unique public URL, widely recognised by technical recruiters. Scores are private if you fail; retake after a waiting period. Intermediate (35 min) and Advanced (60 min) exams also free.",linkLabel:"hackerrank.com",href:"https://www.hackerrank.com/skills-verification/sql_basic",cardBg:"linear-gradient(135deg, rgba(209,250,229,0.75), rgba(167,243,208,0.38))",borderColor:"rgba(5,150,105,0.20)",accentColor:"#059669"},{badge:"Credly Badge",badgeBg:"rgba(37,99,235,0.10)",badgeColor:"#1e3a8a",title:"Cisco NetAcad — Data Analytics Essentials",tag:"DIGITAL BADGE + CERT · BEGINNER · ≈30 hrs",tagColor:"#1d4ed8",description:"One of the most generous truly-free programs online — 660,000+ learners enrolled. Covers Excel, an introduction to relational databases and SQL (Modules 6 & 7), Tableau, data visualisation, and data ethics across 10 modules and 29 hands-on labs. Earns a free Credly-verified digital badge and certificate of completion from Cisco. Free NetAcad account; no credit card.",linkLabel:"netacad.com",href:"https://www.netacad.com/catalogs/learn",cardBg:"linear-gradient(135deg, rgba(219,234,254,0.80), rgba(186,230,253,0.42))",borderColor:"rgba(37,99,235,0.18)",accentColor:"#1d4ed8"},{badge:"ACE Cert",badgeBg:"rgba(109,40,217,0.10)",badgeColor:"#4c1d95",title:"Saylor Academy — CS403: Intro to Modern Database Systems",tag:"COMPLETION CERT · BEGINNER · ≈42 hrs",tagColor:"#7c3aed",description:"The best single free option for database theory — one of the very few truly-free courses that covers both ER diagrams AND SQL in depth. Topics include database architecture, the Entity-Relationship model, relational algebra, data normalisation, SQL SELECT and JOINs, and database design. A free proctored final exam (≥70% to pass) earns an ACE-recommended completion certificate.",linkLabel:"learn.saylor.org",href:"https://learn.saylor.org/course/view.php?id=93",cardBg:"linear-gradient(135deg, rgba(237,233,254,0.85), rgba(221,214,254,0.45))",borderColor:"rgba(109,40,217,0.18)",accentColor:"#7c3aed"},{badge:"Kaggle PDF",badgeBg:"rgba(6,182,212,0.10)",badgeColor:"#164e63",title:"Kaggle Learn — Intro to SQL (Google)",tag:"PDF CERTIFICATE · BEGINNER · ≈3 hrs",tagColor:"#0891b2",description:'A practical browser-based course by Kaggle (a Google company) using BigQuery — covering SELECT, FROM, WHERE, GROUP BY, ORDER BY, AS, and WITH. A free downloadable PDF certificate is issued automatically when all module exercises are complete. Kaggle also offers a free "Advanced SQL" certificate (≈4 hrs) covering JOINs, analytic functions, nested data, and query efficiency.',linkLabel:"kaggle.com/learn/intro-to-sql",href:"https://www.kaggle.com/learn/intro-to-sql",cardBg:"linear-gradient(135deg, rgba(207,250,254,0.80), rgba(165,243,252,0.42))",borderColor:"rgba(6,182,212,0.20)",accentColor:"#0891b2"},{badge:"Completion Cert",badgeBg:"rgba(79,70,229,0.10)",badgeColor:"#312e81",title:"SoloLearn — Introduction to SQL",tag:"CERTIFICATE · BEGINNER · MOBILE-FRIENDLY",tagColor:"#4338ca",description:"A mobile-friendly ≈5–10-hour course covering SQL CRUD operations, filtering, sorting, joins, and basic relational concepts that apply directly to MySQL. A free completion certificate is issued after finishing all lessons and Code Coach problems. A free SQL Intermediate course is also available. Free SoloLearn account on web or mobile app; no credit card.",linkLabel:"sololearn.com",href:"https://www.sololearn.com/en/learn/courses/sql-introduction",cardBg:"linear-gradient(135deg, rgba(224,231,255,0.85), rgba(199,210,254,0.45))",borderColor:"rgba(79,70,229,0.18)",accentColor:"#4338ca"},{badge:"IBM Badge",badgeBg:"rgba(29,78,216,0.10)",badgeColor:"#1e3a8a",title:"IBM / Cognitive Class — SQL and Relational Databases 101",tag:"IBM DIGITAL BADGE · BEGINNER · ≈5–6 hrs",tagColor:"#1d4ed8",description:"An IBM-backed course covering relational model concepts, the five basic SQL statements, advanced SQL syntax, and JOIN statements — with hands-on exercises and a final exam. Passing the exam earns both a free completion certificate and an IBM digital badge issued via Credly. Free Cognitive Class / IBM ID account; no credit card required.",linkLabel:"cognitiveclass.ai",href:"https://cognitiveclass.ai/courses/learn-sql-relational-databases",cardBg:"linear-gradient(135deg, rgba(219,234,254,0.85), rgba(191,219,254,0.42))",borderColor:"rgba(29,78,216,0.18)",accentColor:"#1d4ed8"},{badge:"FCC Cert",badgeBg:"rgba(5,150,105,0.10)",badgeColor:"#064e3b",title:"freeCodeCamp — Relational Database Certification",tag:"PUBLIC CERT · PROJECT-BASED · ≈300 hrs",tagColor:"#047857",description:"One of the most respected truly-free programming certifications. Project-based work covering Bash, PostgreSQL/relational databases, Git, and building relational databases from scratch — with SQL skills that transfer directly to MySQL. Complete five required projects to earn a publicly verifiable certification on your freeCodeCamp profile. 100% open-source and free.",linkLabel:"freecodecamp.org",href:"https://www.freecodecamp.org/learn/relational-database/",cardBg:"linear-gradient(135deg, rgba(209,250,229,0.85), rgba(187,247,208,0.42))",borderColor:"rgba(5,150,105,0.20)",accentColor:"#047857"},{badge:"SkillUp",badgeBg:"rgba(217,119,6,0.10)",badgeColor:"#78350f",title:"Simplilearn SkillUp — SQL & Database Course Bundle",tag:"FREE CERT BUNDLE · BEGINNER · 1–9 hrs each",tagColor:"#b45309",description:"Multiple free SQL/database tracks on Simplilearn's SkillUp platform — covering Introduction to Databases, SQL Fundamentals, SQL for Data Analysis, SQL for Data Science, and SQL Projects. Each course issues a free downloadable PDF completion certificate automatically. All self-paced; free SkillUp account; no credit card required.",linkLabel:"simplilearn.com/skillup",href:"https://www.simplilearn.com/learn-basics-of-databases-free-course-skillup",cardBg:"linear-gradient(135deg, rgba(254,243,199,0.90), rgba(253,230,138,0.42))",borderColor:"rgba(217,119,6,0.20)",accentColor:"#b45309"}],r=[{icon:"👁️",title:"Recruiter Visibility",desc:"Database and SQL skills are in high demand — hiring managers actively search LinkedIn for certified candidates every single day."},{icon:"🤝",title:"Grow Your Network",desc:"Your post reaches your connections, their connections, and beyond — compounding your professional presence."},{icon:"💼",title:"Instant Credibility",desc:"A vendor-issued or verifiable certificate signals initiative and drive — the exact qualities employers look for in graduates."},{icon:"🚀",title:"Career Momentum",desc:"Every credential you post builds a public track record that speaks for you before any interview begins."}],o=[{label:"W3Schools MySQL Tutorial",href:"https://www.w3schools.com/mysql/",note:"Free study material (cert exam is paid)"},{label:"MySQL Official Documentation",href:"https://dev.mysql.com/doc/",note:"Free vendor reference"},{label:"Kaggle — Advanced SQL",href:"https://www.kaggle.com/learn/advanced-sql",note:"Free cert · JOINs, analytic functions, nested data"},{label:"HackerRank — SQL Intermediate",href:"https://www.hackerrank.com/skills-verification/sql_intermediate",note:"Free 35-min skill cert"},{label:"HackerRank — SQL Advanced",href:"https://www.hackerrank.com/skills-verification/sql_advanced",note:"Free 60-min skill cert"},{label:"Oracle SQL Explorer Path",href:"https://mylearn.oracle.com",note:'Free vendor-neutral SQL badge (search "Oracle SQL Explorer")'},{label:"IBM SkillsBuild — Data Catalog",href:"https://skillsbuild.org/",note:"Free DB learning paths with completion certs"},{label:"SoloLearn — SQL Intermediate",href:"https://www.sololearn.com/en/learn/courses/sql-intermediate",note:"Free completion cert"},{label:"SQLZoo / SQLBolt / Mode SQL",href:"https://sqlzoo.net/",note:"Free interactive practice (no certificate)"}];return e.jsxs("div",{className:"space-y-6",children:[e.jsx("style",{children:`
        @keyframes fmc-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes fmc-float2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50%       { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes fmc-float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.15); }
        }
        @keyframes fmc-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(0,119,181,0.35), 0 8px 32px rgba(0,119,181,0.2); }
          50%       { box-shadow: 0 0 48px rgba(0,119,181,0.65), 0 12px 48px rgba(0,119,181,0.35); }
        }
        @keyframes fmc-badge-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(109,40,217,0.0); }
          50%       { box-shadow: 0 0 16px 4px rgba(109,40,217,0.25); }
        }
        @keyframes fmc-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fmc-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fmc-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(0.6); }
        }
        @keyframes fmc-ping-slow {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fmc-slide-up {
          from { transform: translateY(14px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes fmc-rank-reveal {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .fmc-float-1 { animation: fmc-float  2.8s ease-in-out infinite; }
        .fmc-float-2 { animation: fmc-float2 3.2s ease-in-out infinite 0.4s; }
        .fmc-float-3 { animation: fmc-float3 2.4s ease-in-out infinite 0.8s; }
        .fmc-float-4 { animation: fmc-float  3.6s ease-in-out infinite 1.2s; }
        .fmc-float-5 { animation: fmc-float2 2.6s ease-in-out infinite 0.2s; }
        .fmc-glow-card { animation: fmc-glow 3s ease-in-out infinite; }
        .fmc-shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #bfdbfe 40%, #fff 60%, #93c5fd 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fmc-shimmer 4s linear infinite;
        }
        .fmc-btn-shimmer {
          background: linear-gradient(90deg, #fff 0%, #dbeafe 40%, #fff 60%, #e0f2fe 100%);
          background-size: 300% auto;
          animation: fmc-shimmer 2.5s linear infinite;
        }
        .fmc-pop-in { animation: fmc-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }
        .fmc-twinkle-1 { animation: fmc-twinkle 1.8s ease-in-out infinite; }
        .fmc-twinkle-2 { animation: fmc-twinkle 2.4s ease-in-out infinite 0.6s; }
        .fmc-twinkle-3 { animation: fmc-twinkle 1.5s ease-in-out infinite 1.1s; }
        .fmc-cert-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .fmc-cert-card:hover { transform: translateY(-4px) scale(1.015); box-shadow: 0 10px 28px rgba(0,0,0,0.10); }
        .fmc-slide-up { animation: fmc-slide-up 0.55s ease both; }
        .fmc-rank-pill { animation: fmc-rank-reveal 0.4s ease both; }
        .fmc-badge-pulse { animation: fmc-badge-glow 2.5s ease-in-out infinite; }
      `}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider",style:{color:"#7c3aed"},children:"Resource"}),e.jsx("h3",{className:"text-lg font-bold mt-1",style:{color:"#1e1b4b"},children:"Free MySQL / SQL / Database Design Certifications"}),e.jsxs("p",{className:"text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",style:{color:"#4c1d95",background:"rgba(221,214,254,0.55)"},children:[e.jsx(Oe,{size:12})," MBI802 · Database Management Systems"]})]}),e.jsxs("div",{className:"rounded-2xl p-4 border fmc-slide-up",style:{background:"linear-gradient(135deg, rgba(237,233,254,0.8), rgba(224,231,255,0.5))",borderColor:"rgba(109,40,217,0.18)"},children:[e.jsx("p",{className:"text-xs font-bold mb-2",style:{color:"#5b21b6"},children:"📖 Quick Terminology"}),e.jsxs("div",{className:"space-y-1 text-xs",style:{color:"#4c1d95"},children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Badge / digital credential"})," — Shareable, verifiable credential you can post directly to LinkedIn."]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Certificate of completion"})," — Downloadable PDF awarded after finishing course materials."]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-semibold",children:"Skill certification exam"})," — Assessment-based credential you can claim by passing a test, even without a course."]})]})]}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:"Nine genuinely free MySQL, SQL, and database-design credentials — from vendor badges to skill exams and project-based certifications. Every option below is completely free to earn (no credit card required). Recommended to complement your MBI802 coursework and strengthen your CV and LinkedIn profile."}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",children:t.map((h,s)=>e.jsxs("div",{className:"fmc-cert-card rounded-2xl p-4 border flex flex-col gap-3",style:{background:h.cardBg,borderColor:h.borderColor},children:[e.jsxs("div",{className:"flex items-start justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"fmc-rank-pill text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full shrink-0",style:{background:h.accentColor,color:"#fff",animationDelay:`${s*.08}s`,fontSize:11},children:s+1}),e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider",style:{color:h.tagColor},children:h.tag})]}),e.jsx("span",{className:"fmc-badge-pulse text-xs font-bold px-2 py-0.5 rounded-full shrink-0",style:{background:h.badgeBg,color:h.badgeColor},children:h.badge})]}),e.jsx("p",{className:"text-sm font-semibold",style:{color:"#1e1b4b"},children:h.title}),e.jsx("p",{className:"text-xs leading-5 flex-1",style:{color:"#374151"},children:h.description}),e.jsxs("a",{href:h.href,target:"_blank",rel:"noreferrer",className:"mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:underline",style:{color:h.accentColor},children:[e.jsx(ce,{size:13}),h.linkLabel]})]},h.badge+s))}),e.jsxs("div",{className:"rounded-2xl p-4 border",style:{background:"linear-gradient(135deg, rgba(243,244,246,0.9), rgba(249,250,251,0.7))",borderColor:"rgba(139,92,246,0.14)"},children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider mb-3",style:{color:"#6d28d9"},children:"🔗 Useful Free Learning Resources — No Certificate, But Great for Practice"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:o.map(h=>e.jsxs("a",{href:h.href,target:"_blank",rel:"noreferrer",className:"flex flex-col gap-0.5 p-2.5 rounded-xl border hover:border-violet-300 transition-all",style:{background:"rgba(255,255,255,0.8)",borderColor:"rgba(139,92,246,0.12)",textDecoration:"none"},children:[e.jsxs("span",{className:"text-xs font-semibold inline-flex items-center gap-1",style:{color:"#5b21b6"},children:[e.jsx(ce,{size:11}),h.label]}),e.jsx("span",{className:"text-xs",style:{color:"#6b7280"},children:h.note})]},h.label))})]}),e.jsxs("div",{className:"fmc-glow-card rounded-3xl overflow-hidden",style:{background:"linear-gradient(135deg, #004f80 0%, #0077B5 45%, #00a0dc 100%)",position:"relative"},children:[e.jsx("div",{style:{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",bottom:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",top:"40%",left:"55%",width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",top:14,right:18,fontSize:28,zIndex:1,pointerEvents:"none"},className:"fmc-float-1",children:"🎉"}),e.jsx("div",{style:{position:"absolute",top:52,right:56,fontSize:20,zIndex:1,pointerEvents:"none"},className:"fmc-float-2",children:"⭐"}),e.jsx("div",{style:{position:"absolute",bottom:18,right:22,fontSize:26,zIndex:1,pointerEvents:"none"},className:"fmc-float-3",children:"🏆"}),e.jsx("div",{style:{position:"absolute",bottom:56,right:70,fontSize:18,zIndex:1,pointerEvents:"none"},className:"fmc-float-4",children:"✨"}),e.jsx("div",{style:{position:"absolute",top:90,right:16,fontSize:16,zIndex:1,pointerEvents:"none"},className:"fmc-float-5",children:"🚀"}),e.jsx("div",{style:{position:"absolute",top:130,right:44,fontSize:14,zIndex:1,pointerEvents:"none"},className:"fmc-float-1",children:"🗄️"}),e.jsx("div",{style:{position:"absolute",top:22,left:130,fontSize:10,color:"rgba(255,255,255,0.7)",pointerEvents:"none"},className:"fmc-twinkle-1",children:"★"}),e.jsx("div",{style:{position:"absolute",top:60,left:80,fontSize:8,color:"rgba(255,255,255,0.6)",pointerEvents:"none"},className:"fmc-twinkle-2",children:"★"}),e.jsx("div",{style:{position:"absolute",bottom:40,left:160,fontSize:12,color:"rgba(255,255,255,0.5)",pointerEvents:"none"},className:"fmc-twinkle-3",children:"★"}),e.jsxs("div",{className:"p-6",style:{position:"relative",zIndex:2},children:[e.jsxs("div",{className:"flex items-center gap-3 mb-5",children:[e.jsx("div",{style:{background:"white",borderRadius:12,padding:"8px 8px 6px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,0.18)"},children:e.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"#0077B5",children:e.jsx("path",{d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"fmc-shimmer-text font-extrabold text-xl leading-tight",children:"Share Your Achievement!"}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:"rgba(186,230,253,0.9)"},children:"Let the world know you levelled up 🌍"})]})]}),e.jsx("div",{className:"fmc-pop-in rounded-2xl p-4 mb-5",style:{background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.2)",backdropFilter:"blur(6px)"},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("span",{style:{fontSize:36,lineHeight:1,color:"rgba(255,255,255,0.35)",fontFamily:"Georgia, serif",flexShrink:0},children:'"'}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-white text-sm leading-relaxed",children:["I am ",e.jsx("span",{className:"font-bold",style:{color:"#bfdbfe"},children:"genuinely excited"})," to see your certification! Database skills are among the most in-demand competencies in the industry right now. Earning a free credential shows initiative, dedication, and a growth mindset — exactly the qualities that stand out to employers. Please post your achievement on LinkedIn and ",e.jsx("span",{className:"font-bold text-white",children:"tag me"})," — I personally celebrate every single one of my students who levels up! 🎓"]}),e.jsxs("div",{className:"flex items-center gap-2 mt-3",children:[e.jsxs("div",{style:{position:"relative",width:10,height:10,flexShrink:0},children:[e.jsx("div",{style:{position:"absolute",inset:0,borderRadius:"50%",background:"#4ade80",animation:"fmc-ping-slow 1.5s ease-out infinite"}}),e.jsx("div",{style:{position:"absolute",inset:"2px",borderRadius:"50%",background:"#22c55e"}})]}),e.jsx("a",{href:"https://www.linkedin.com/in/yasassri/",target:"_blank",rel:"noreferrer",className:"text-xs font-bold hover:underline",style:{color:"#bfdbfe"},children:"Yasas Sri Wickramasinghe"}),e.jsx("span",{className:"text-xs",style:{color:"rgba(186,230,253,0.7)"},children:"· MBI802 Lecturer"})]})]})]})}),e.jsxs("div",{className:"mb-5",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-widest mb-3",style:{color:"rgba(186,230,253,0.85)"},children:"Why your LinkedIn post matters"}),e.jsx("div",{className:"grid grid-cols-2 gap-2",children:r.map((h,s)=>e.jsxs("div",{className:"rounded-xl p-3",style:{background:"rgba(255,255,255,0.10)",border:"1px solid rgba(255,255,255,0.15)",animationDelay:`${s*.1}s`},children:[e.jsx("div",{style:{fontSize:20,marginBottom:4},children:h.icon}),e.jsx("p",{className:"text-white text-xs font-bold",children:h.title}),e.jsx("p",{className:"text-xs leading-4 mt-0.5",style:{color:"rgba(186,230,253,0.8)"},children:h.desc})]},h.title))})]}),e.jsxs("div",{className:"rounded-xl p-3 mb-5 text-xs leading-5",style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)"},children:[e.jsx("p",{className:"font-bold text-white mb-1",children:"💡 What to write in your post"}),e.jsxs("p",{style:{color:"rgba(219,234,254,0.9)"},children:["Share what you learned, which certification you earned, and how database skills connect to your career goals. Tag ",e.jsx("span",{className:"font-semibold text-white",children:"@YasasSriWickramasinghe"})," so I can celebrate with you!"]})]}),e.jsxs("a",{href:"https://www.linkedin.com/in/yasassri/",target:"_blank",rel:"noreferrer",className:"fmc-btn-shimmer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-transform hover:scale-105 active:scale-95",style:{color:"#004f80",boxShadow:"0 4px 20px rgba(0,0,0,0.25)",textDecoration:"none"},children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"#0077B5",children:e.jsx("path",{d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"})}),"Tag Yasas Sri Wickramasinghe on LinkedIn",e.jsx(ce,{size:14})]})]})]}),e.jsxs("div",{className:"rounded-xl p-3 border text-xs leading-5",style:{background:"rgba(249,250,251,0.8)",borderColor:"rgba(209,213,219,0.6)",color:"#6b7280"},children:[e.jsx("span",{className:"font-semibold",style:{color:"#374151"},children:"A note before you enrol: "}),"These platforms may update their pricing, enrolment processes, or certificate availability at any time — always read the course page carefully before signing up to confirm it is still free. These are independent suggestions only. This course has no affiliation with, sponsorship from, or endorsement by any of the platforms listed above. All trademarks and certifications belong to their respective owners."]})]})}function xi(){const t=[{badge:"SFC™",badgeBg:"rgba(5,150,105,0.12)",badgeColor:"#065f46",title:"SCRUMstudy – Scrum Fundamentals Certified",tag:"SCRUM FUNDAMENTALS",tagColor:"#059669",description:"One of the most established free Scrum credentials. Covers all core Scrum principles, phases, and team roles based on the SBOK® Guide. No time limit — study at your own pace, then take a 40-question online exam (75% to pass). The certificate has no expiry and is recognised globally as a solid entry-level credential to add to your CV or LinkedIn.",linkLabel:"scrumstudy.com",href:"https://www.scrumstudy.com/certification/scrum-fundamentals-certified",cardBg:"linear-gradient(135deg, rgba(209,250,229,0.7), rgba(167,243,208,0.4))",borderColor:"rgba(5,150,105,0.2)",accentColor:"#059669"},{badge:"RSB",badgeBg:"rgba(37,99,235,0.1)",badgeColor:"#1e3a8a",title:"Scrum Inc. – Registered Scrum Basics™",tag:"SCRUM BASICS",tagColor:"#1d4ed8",description:"Developed by Scrum Inc. — the organisation founded by Scrum co-creator Dr. Jeff Sutherland — in partnership with Atlassian and Accenture. Covers the Agile mindset, the full Scrum framework, and how Scrum is applied in real teams. Complete the Atlassian Community learning path, then pass a short online assessment to receive a verifiable digital credential from Scrum Inc. Takes only a few hours.",linkLabel:"community.atlassian.com",href:"https://community.atlassian.com/t5/Agile/ct-p/agile",cardBg:"linear-gradient(135deg, rgba(219,234,254,0.7), rgba(186,230,253,0.4))",borderColor:"rgba(37,99,235,0.18)",accentColor:"#1d4ed8"},{badge:"SkillUp",badgeBg:"rgba(217,119,6,0.1)",badgeColor:"#78350f",title:"Simplilearn SkillUp – Agile Scrum Master Basics",tag:"SCRUM MASTER BASICS",tagColor:"#b45309",description:"A ~5-hour self-paced video course introducing Agile, the Scrum framework, the Scrum Master role, and an overview of the Scaled Agile Framework (SAFe). A course completion certificate is automatically unlocked in your dashboard once all modules are done — no extra exam or upgrade required. Best used as structured self-study to deepen understanding of the Scrum Master role before pursuing paid industry credentials.",linkLabel:"simplilearn.com",href:"https://www.simplilearn.com/agile-and-scrum-free-course-skillup",cardBg:"linear-gradient(135deg, rgba(254,243,199,0.8), rgba(253,230,138,0.4))",borderColor:"rgba(217,119,6,0.18)",accentColor:"#b45309"},{badge:"ACH Badge",badgeBg:"rgba(79,70,229,0.1)",badgeColor:"#312e81",title:"Atlassian University – Agile & Jira Fundamentals",tag:"AGILE + JIRA",tagColor:"#4338ca",description:"A practical, tool-focused credential from Atlassian covering Agile principles and how to manage Scrum teams using Jira — sprint planning, backlog management, Scrum boards, and Kanban. Complete a short course then pass a free online assessment (80% pass mark) to earn a free Atlassian Credentials Hub (ACH) digital badge. Especially useful as most real-world Scrum teams use Jira as their project tool.",linkLabel:"university.atlassian.com",href:"https://university.atlassian.com",cardBg:"linear-gradient(135deg, rgba(237,233,254,0.8), rgba(224,231,255,0.5))",borderColor:"rgba(79,70,229,0.18)",accentColor:"#4338ca"}],r=[{icon:"👁️",title:"Recruiter Visibility",desc:"Hiring managers actively search LinkedIn for certified Agile & Scrum professionals every single day."},{icon:"🤝",title:"Grow Your Network",desc:"Your post reaches your connections, their connections, and beyond — compounding your professional presence."},{icon:"💼",title:"Instant Credibility",desc:"A public certificate post signals drive and initiative — the exact traits employers look for in graduates."},{icon:"🚀",title:"Career Momentum",desc:"Every credential you post builds a public track record that speaks for you before any interview begins."}];return e.jsxs("div",{className:"space-y-6",children:[e.jsx("style",{children:`
        @keyframes fac-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes fac-float2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50%       { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes fac-float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.15); }
        }
        @keyframes fac-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(0,119,181,0.35), 0 8px 32px rgba(0,119,181,0.2); }
          50%       { box-shadow: 0 0 48px rgba(0,119,181,0.65), 0 12px 48px rgba(0,119,181,0.35); }
        }
        @keyframes fac-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fac-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fac-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fac-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(0.6); }
        }
        @keyframes fac-ping-slow {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fac-slide-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .fac-float-1 { animation: fac-float  2.8s ease-in-out infinite; }
        .fac-float-2 { animation: fac-float2 3.2s ease-in-out infinite 0.4s; }
        .fac-float-3 { animation: fac-float3 2.4s ease-in-out infinite 0.8s; }
        .fac-float-4 { animation: fac-float  3.6s ease-in-out infinite 1.2s; }
        .fac-float-5 { animation: fac-float2 2.6s ease-in-out infinite 0.2s; }
        .fac-glow-card { animation: fac-glow 3s ease-in-out infinite; }
        .fac-shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #bfdbfe 40%, #fff 60%, #93c5fd 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fac-shimmer 4s linear infinite;
        }
        .fac-btn-shimmer {
          background: linear-gradient(90deg, #fff 0%, #dbeafe 40%, #fff 60%, #e0f2fe 100%);
          background-size: 300% auto;
          animation: fac-shimmer 2.5s linear infinite;
        }
        .fac-pop-in { animation: fac-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }
        .fac-twinkle-1 { animation: fac-twinkle 1.8s ease-in-out infinite; }
        .fac-twinkle-2 { animation: fac-twinkle 2.4s ease-in-out infinite 0.6s; }
        .fac-twinkle-3 { animation: fac-twinkle 1.5s ease-in-out infinite 1.1s; }
        .fac-cert-card:hover { transform: translateY(-3px) scale(1.01); transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .fac-cert-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fac-slide-up { animation: fac-slide-up 0.6s ease both; }
      `}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wider",style:{color:"#059669"},children:"Resource"}),e.jsx("h3",{className:"text-lg font-bold mt-1",style:{color:"#1e1b4b"},children:"Free Agile & Scrum Certifications"}),e.jsxs("p",{className:"text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",style:{color:"#065f46",background:"rgba(167,243,208,0.45)"},children:[e.jsx(Oe,{size:12})," MBI804 · IT Project Management"]})]}),e.jsx("p",{className:"text-sm leading-6",style:{color:"#374151"},children:"Four no-cost options where both the course and the completion certificate are free. Recommended to complement your Agile Scrum coursework."}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:t.map(o=>e.jsxs("div",{className:"fac-cert-card rounded-2xl p-4 border flex flex-col gap-3",style:{background:o.cardBg,borderColor:o.borderColor},children:[e.jsxs("div",{className:"flex items-start justify-between gap-2",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-wider",style:{color:o.tagColor},children:o.tag}),e.jsx("p",{className:"text-sm font-semibold mt-0.5",style:{color:"#1e1b4b"},children:o.title})]}),e.jsx("span",{className:"text-xs font-bold px-2 py-0.5 rounded-full shrink-0",style:{background:o.badgeBg,color:o.badgeColor},children:o.badge})]}),e.jsx("p",{className:"text-xs leading-5",style:{color:"#374151"},children:o.description}),e.jsxs("a",{href:o.href,target:"_blank",rel:"noreferrer",className:"mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:underline",style:{color:o.accentColor},children:[e.jsx(ce,{size:13}),o.linkLabel]})]},o.badge))}),e.jsxs("div",{className:"fac-glow-card rounded-3xl overflow-hidden",style:{background:"linear-gradient(135deg, #004f80 0%, #0077B5 45%, #00a0dc 100%)",position:"relative"},children:[e.jsx("div",{style:{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",bottom:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",top:14,right:18,fontSize:28,zIndex:1,pointerEvents:"none"},className:"fac-float-1",children:"🎉"}),e.jsx("div",{style:{position:"absolute",top:52,right:56,fontSize:20,zIndex:1,pointerEvents:"none"},className:"fac-float-2",children:"⭐"}),e.jsx("div",{style:{position:"absolute",bottom:18,right:22,fontSize:26,zIndex:1,pointerEvents:"none"},className:"fac-float-3",children:"🏆"}),e.jsx("div",{style:{position:"absolute",bottom:56,right:70,fontSize:18,zIndex:1,pointerEvents:"none"},className:"fac-float-4",children:"✨"}),e.jsx("div",{style:{position:"absolute",top:90,right:16,fontSize:16,zIndex:1,pointerEvents:"none"},className:"fac-float-5",children:"🚀"}),e.jsx("div",{style:{position:"absolute",top:22,left:130,fontSize:10,pointerEvents:"none"},className:"fac-twinkle-1",children:"★"}),e.jsx("div",{style:{position:"absolute",top:60,left:80,fontSize:8,color:"rgba(255,255,255,0.6)",pointerEvents:"none"},className:"fac-twinkle-2",children:"★"}),e.jsx("div",{style:{position:"absolute",bottom:40,left:160,fontSize:12,color:"rgba(255,255,255,0.5)",pointerEvents:"none"},className:"fac-twinkle-3",children:"★"}),e.jsxs("div",{className:"p-6",style:{position:"relative",zIndex:2},children:[e.jsxs("div",{className:"flex items-center gap-3 mb-5",children:[e.jsx("div",{style:{background:"white",borderRadius:12,padding:"8px 8px 6px",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,0.18)"},children:e.jsx("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"#0077B5",children:e.jsx("path",{d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"fac-shimmer-text font-extrabold text-xl leading-tight",children:"Share Your Achievement!"}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:"rgba(186,230,253,0.9)"},children:"Let the world know you levelled up 🌍"})]})]}),e.jsx("div",{className:"fac-pop-in rounded-2xl p-4 mb-5",style:{background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.2)",backdropFilter:"blur(6px)"},children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("span",{style:{fontSize:36,lineHeight:1,color:"rgba(255,255,255,0.35)",fontFamily:"Georgia, serif",flexShrink:0},children:'"'}),e.jsxs("div",{children:[e.jsxs("p",{className:"text-white text-sm leading-relaxed",children:["I am ",e.jsx("span",{className:"font-bold",style:{color:"#bfdbfe"},children:"truly excited"})," to hear about your completion! Earning a free certification shows initiative, dedication, and a growth mindset — exactly the qualities that stand out in the industry. Please post your achievement on LinkedIn and ",e.jsx("span",{className:"font-bold text-white",children:"tag me"})," — I personally celebrate every single one of my students who levels up! 🎓"]}),e.jsxs("div",{className:"flex items-center gap-2 mt-3",children:[e.jsxs("div",{style:{position:"relative",width:10,height:10,flexShrink:0},children:[e.jsx("div",{style:{position:"absolute",inset:0,borderRadius:"50%",background:"#4ade80",animation:"fac-ping-slow 1.5s ease-out infinite"}}),e.jsx("div",{style:{position:"absolute",inset:"2px",borderRadius:"50%",background:"#22c55e"}})]}),e.jsx("a",{href:"https://www.linkedin.com/in/yasassri/",target:"_blank",rel:"noreferrer",className:"text-xs font-bold hover:underline",style:{color:"#bfdbfe"},children:"Yasas Sri Wickramasinghe"}),e.jsx("span",{className:"text-xs",style:{color:"rgba(186,230,253,0.7)"},children:"· MBI804 Lecturer"})]})]})]})}),e.jsxs("div",{className:"mb-5",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-widest mb-3",style:{color:"rgba(186,230,253,0.85)"},children:"Why your LinkedIn post matters"}),e.jsx("div",{className:"grid grid-cols-2 gap-2",children:r.map((o,h)=>e.jsxs("div",{className:"rounded-xl p-3",style:{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",animationDelay:`${h*.1}s`},children:[e.jsx("div",{style:{fontSize:20,marginBottom:4},children:o.icon}),e.jsx("p",{className:"text-white text-xs font-bold",children:o.title}),e.jsx("p",{className:"text-xs leading-4 mt-0.5",style:{color:"rgba(186,230,253,0.8)"},children:o.desc})]},o.title))})]}),e.jsxs("div",{className:"rounded-xl p-3 mb-5 text-xs leading-5",style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)"},children:[e.jsx("p",{className:"font-bold text-white mb-1",children:"💡 What to write in your post"}),e.jsxs("p",{style:{color:"rgba(219,234,254,0.9)"},children:["Share what you learned, why you chose the certification, and how it connects to your career goals. Tag ",e.jsx("span",{className:"font-semibold text-white",children:"@YasasSriWickramasinghe"})]})]}),e.jsxs("a",{href:"https://www.linkedin.com/in/yasassri/",target:"_blank",rel:"noreferrer",className:"fac-btn-shimmer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-transform hover:scale-105 active:scale-95",style:{color:"#004f80",boxShadow:"0 4px 20px rgba(0,0,0,0.25)",textDecoration:"none"},children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"#0077B5",children:e.jsx("path",{d:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"})}),"Tag Yasas Sri Wickramasinghe on LinkedIn",e.jsx(ce,{size:14})]})]})]}),e.jsxs("div",{className:"rounded-xl p-3 border text-xs leading-5",style:{background:"rgba(249,250,251,0.8)",borderColor:"rgba(209,213,219,0.6)",color:"#6b7280"},children:[e.jsx("span",{className:"font-semibold",style:{color:"#374151"},children:"A note before you enrol: "}),"These platforms may update their pricing, enrolment processes, or certificate availability at any time — always read the course page carefully before signing up to confirm it is still free. These are independent suggestions only. This course has no affiliation with, sponsorship from, or endorsement by any of the platforms listed above. All trademarks and certifications belong to their respective owners."]})]})}function fi({lesson:t,index:r,isOpen:o,onToggle:h,children:s,locked:w=!1}){return e.jsxs("div",{className:"rounded-2xl overflow-hidden transition-all",style:{border:w?"1.5px solid rgba(156,163,175,0.25)":o?`1.5px solid ${t.accentColor}40`:"1.5px solid rgba(139,92,246,0.10)",background:w?"rgba(249,250,251,0.7)":o?"rgba(255,255,255,1)":"rgba(255,255,255,0.7)",boxShadow:w?"none":o?`0 4px 24px ${t.accentColor}18`:"0 1px 4px rgba(0,0,0,0.04)",opacity:w?.7:1},children:[e.jsxs("button",{onClick:w?void 0:h,disabled:w,className:"w-full text-left flex items-center gap-4 px-5 py-4 transition-all",style:{background:w?"transparent":o?`${t.accentColor}08`:"transparent",cursor:w?"not-allowed":"pointer"},children:[e.jsx("div",{className:"flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",style:{background:w?"rgba(156,163,175,0.12)":`${t.accentColor}15`,color:w?"#9ca3af":t.accentColor},children:w?e.jsx(he,{size:18}):t.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{className:"text-xs font-bold uppercase tracking-wider",style:{color:w?"#9ca3af":t.accentColor,opacity:w?1:.7},children:["Lesson ",r+1]}),w&&e.jsx("span",{className:"text-[10px] font-semibold px-1.5 py-0.5 rounded-full",style:{background:"rgba(239,68,68,0.1)",color:"#dc2626"},children:"Locked"})]}),e.jsx("p",{className:"text-sm font-semibold mt-0.5",style:{color:w?"#9ca3af":"#1e1b4b"},children:t.title}),e.jsx("p",{className:"text-xs mt-0.5",style:{color:w?"#d1d5db":"#6b7280"},children:w?"Score above 50% in the ER Knowledge Check to unlock this lesson.":t.subtitle})]}),e.jsx("div",{className:"flex-shrink-0 transition-transform duration-200",style:{color:w?"#d1d5db":t.accentColor,transform:o?"rotate(180deg)":"rotate(0deg)"},children:!w&&e.jsx(Y,{size:18})})]}),o&&!w&&e.jsx("div",{className:"px-5 pb-5 pt-1 border-t animate-fadeIn",style:{borderColor:`${t.accentColor}20`},children:s})]})}function wi(){const{user:t,role:r}=me(),o=r==="lecturer"||r==="teachingAssistant",[h,s]=a.useState(r==="student"),[w,A]=a.useState(null),[N,z]=a.useState(o?["MBI800","MBI802","MBI804"]:[]),[M,S]=a.useState(!1),[D,f]=a.useState("MBI802"),[g,d]=a.useState(null),[l,c]=a.useState({}),[b,v]=a.useState({});if(a.useEffect(()=>{!t||o||(async()=>{const[n,i]=await Promise.all([Re($(U,"students",t.uid)),Re($(U,"erMcqResults",t.uid))]),u=n.exists()?n.data():null;A(u);const C=u?.subjects??[];z(C);const y=ot.map(x=>x.id).find(x=>C.includes(x));if(y&&f(y),i.exists()){const x=i.data().bestPercentage??0;S(x>50)}s(!1)})()},[t,o]),a.useEffect(()=>{if(We){c(We.videoMap),v(We.customMap);return}(async()=>{const n=await Mt(ze(U,"videoLessons")),i={},u={};n.docs.forEach(C=>{const p=C.data(),y=p.videos??[];p.isCustomLesson?(u[p.courseId]||(u[p.courseId]=[]),u[p.courseId].push({id:p.lessonId,title:p.lessonTitle,subtitle:p.lessonSubtitle??"",icon:e.jsx(rt,{size:18}),accentColor:p.accentColor??"#7c3aed",isCustom:!0}),y.length>0&&(i[`${p.courseId}_${p.lessonId}`]=y)):y.length>0&&(i[`${p.courseId}_${p.lessonId}`]=y)}),We={videoMap:i,customMap:u},c(i),v(u)})()},[]),h)return e.jsx(Ze,{children:e.jsx("div",{className:"flex justify-center py-20",children:e.jsx(ss,{size:"lg"})})});const E=ot.filter(n=>o||n.alwaysVisible||N.includes(n.id));if(!o&&E.length===0)return e.jsx(Ze,{children:e.jsxs("div",{className:"card p-6",children:[e.jsx("h1",{className:"page-title",children:"Course Resources"}),e.jsx("p",{className:"mt-2 text-sm",style:{color:"#6b7280"},children:"You are not enrolled in any subjects that have resources available yet."})]})});const R=ot.find(n=>n.id===D)??E[0],m={...R,lessons:[...R.lessons,...b[R.id]??[]]},k=n=>d(i=>i===n?null:n);return e.jsxs(Ze,{children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:"page-title",children:"Course Resources"}),e.jsx("p",{className:"page-subtitle",children:o?"All course content — visible to staff across all subjects.":"Your enrolled subject resources, lessons, and assessments."})]}),e.jsxs("div",{className:"flex flex-col lg:flex-row gap-5",children:[e.jsxs("div",{className:"lg:w-56 flex-shrink-0",children:[e.jsx("p",{className:"text-xs font-bold uppercase tracking-widest mb-3 px-1",style:{color:"#9ca3af"},children:"Subjects"}),e.jsx("div",{className:"flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1",children:E.map(n=>e.jsx("button",{onClick:()=>{f(n.id),d(null)},className:"flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all",style:{background:D===n.id?n.accentColor:"rgba(255,255,255,0.8)",color:D===n.id?"#fff":"#374151",border:D===n.id?"none":"1.5px solid rgba(0,0,0,0.08)"},children:n.id},n.id))}),e.jsx("div",{className:"hidden lg:flex flex-col gap-2",children:E.map(n=>{const i=D===n.id;return e.jsxs("button",{onClick:()=>{f(n.id),d(null)},className:"text-left rounded-2xl px-4 py-3 transition-all w-full group",style:{background:i?n.accentColor:"rgba(255,255,255,0.8)",border:i?"none":"1.5px solid rgba(139,92,246,0.10)",boxShadow:i?`0 4px 20px ${n.accentColor}30`:"0 1px 4px rgba(0,0,0,0.04)"},children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm font-bold",style:{color:i?"#fff":"#1e1b4b"},children:n.id}),i&&e.jsx(X,{size:14,style:{color:"rgba(255,255,255,0.7)"}})]}),e.jsx("p",{className:"text-xs mt-0.5 leading-4",style:{color:i?"rgba(255,255,255,0.75)":"#6b7280"},children:n.tagline}),e.jsx("p",{className:"text-xs mt-1.5 font-semibold",style:{color:i?"rgba(255,255,255,0.6)":n.accentColor,opacity:i?1:.8},children:(()=>{const u=n.lessons.length+(b[n.id]?.length??0);return u>0?`${u} lesson${u!==1?"s":""}`:"Coming soon"})()})]},n.id)})})]}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"rounded-2xl px-5 py-4 mb-4 flex items-center gap-4",style:{background:m.bgGradient,border:`1.5px solid ${m.accentColor}20`},children:[e.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",style:{background:`${m.accentColor}15`},children:e.jsx(V,{size:20,style:{color:m.accentColor}})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold",style:{color:"#1e1b4b"},children:m.id}),e.jsx("p",{className:"text-xs",style:{color:"#6b7280"},children:m.tagline})]}),o&&e.jsx("span",{className:"ml-auto text-xs font-semibold px-3 py-1 rounded-full",style:{background:`${m.accentColor}15`,color:m.accentColor},children:"Staff view"})]}),m.lessons.length===0?e.jsxs("div",{className:"rounded-2xl px-6 py-12 text-center",style:{background:"rgba(255,255,255,0.7)",border:"1.5px solid rgba(139,92,246,0.10)"},children:[e.jsx("div",{className:"w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4",style:{background:`${m.accentColor}12`},children:e.jsx(Qt,{size:26,style:{color:m.accentColor}})}),e.jsx("p",{className:"text-sm font-bold",style:{color:"#1e1b4b"},children:"Content coming soon"}),e.jsxs("p",{className:"text-xs mt-1",style:{color:"#9ca3af"},children:["Lessons for ",m.id," are being prepared. Check back later."]})]}):e.jsx("div",{className:"flex flex-col gap-3",children:m.lessons.map((n,i)=>{const u=!o&&["normalization","quiz"].includes(n.id)&&!M;return e.jsxs(fi,{lesson:n,index:i,isOpen:g===n.id,onToggle:()=>k(n.id),locked:u,children:[n.id==="setup"&&e.jsx(ni,{}),n.id==="slides"&&e.jsx(di,{}),n.id==="er"&&e.jsx(xs,{}),n.id==="er-activities"&&e.jsxs("div",{children:[e.jsx(gs,{}),e.jsx(Ve,{videos:[...ri,...l[`${m.id}_${n.id}`]??[]],accentColor:"#0d7a72"})]}),n.id==="er-advanced"&&e.jsx(ms,{}),n.id==="er-attr-constraints"&&e.jsx(vs,{}),n.id==="er-mapping"&&e.jsx(ks,{}),n.id==="er-mcq"&&o&&e.jsx(ns,{}),n.id==="er-mcq"&&!o&&e.jsx(ls,{studentProfile:w,onPassStatusChange:C=>S(C)}),n.id==="normalization"&&e.jsxs("div",{children:[e.jsx(zs,{}),e.jsx(Ve,{videos:[...li,...l[`${m.id}_${n.id}`]??[]],accentColor:"#6366f1"})]}),n.id==="quiz"&&e.jsx(ci,{studentProfile:w,isStaff:o}),n.id==="agile-scrum"&&e.jsx($s,{}),n.id==="agile-scrum-mcq"&&o&&e.jsx(ei,{}),n.id==="agile-scrum-mcq"&&!o&&e.jsx(Xs,{studentProfile:w}),n.id==="free-agile-certs"&&e.jsx(xi,{}),n.id==="free-mysql-certs"&&e.jsx(pi,{}),n.id==="sisp-lab"&&e.jsx(Bs,{}),n.id==="sql-practice"&&e.jsx(Vs,{}),n.id==="apa-referencing"&&e.jsx(ii,{}),(()=>{if(["er-activities","normalization"].includes(n.id))return null;const C=l[`${m.id}_${n.id}`];return C?.length?e.jsx(Ve,{videos:C,accentColor:n.accentColor}):null})(),n.isCustom&&!l[`${m.id}_${n.id}`]?.length&&e.jsx("p",{className:"text-sm text-center py-6",style:{color:"#9ca3af"},children:"No videos have been added to this lesson yet."})]},n.id)})}),o&&D==="MBI802"&&e.jsx(oi,{})]})]})]})}export{wi as default};
